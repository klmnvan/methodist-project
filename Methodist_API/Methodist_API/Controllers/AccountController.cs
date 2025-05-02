using AutoMapper;
using Methodist_API.Data;
using Methodist_API.Dtos.Account;
using Methodist_API.Interfaces;
using Methodist_API.Models.DB;
using Methodist_API.Models.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Swashbuckle.AspNetCore.Annotations;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Methodist_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly ITokenService _tokenService;
        private readonly MKDbContext _context;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ILogger<AccountController> _logger;
        private readonly IMapper _mapper;

        public AccountController(UserManager<AppUser> userManager, RoleManager<Role> roleManager, ITokenService tokenService,
            MKDbContext context, SignInManager<AppUser> signInManager, ILogger<AccountController> logger,
            IMapper mapper)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _tokenService = tokenService;
            _context = context;
            _logger = logger;
            _mapper = mapper;
        }

        [SwaggerOperation(Summary = "Регистрация в системе")]
        [HttpPost("Register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var firstError = ModelState.Values.SelectMany(v => v.Errors).FirstOrDefault()?.ErrorMessage;
                    return BadRequest(new { message = firstError });
                }

                var appUser = new AppUser
                {
                    //Username должен быть уникальным, поэтому передаём сюда email
                    Email = registerDto.Email.ToLower(),
                    UserName = registerDto.Email.ToLower()
                };

                //Создается пользователь и возвращается в переменную 
                var createdUser = await _userManager.CreateAsync(appUser, registerDto.Password);

                if (createdUser.Succeeded)
                {
                    //Добавление роли Teacher
                    var roleResult = await _userManager.AddToRoleAsync(appUser, "MEMBER_COMISSION");
                    if (roleResult.Succeeded)
                    {
                        //Получаем объект пользователя по его Email (который уникальный кстати)
                        var user = await _userManager.FindByEmailAsync(registerDto.Email.ToLower());

                        if (user != null)
                        {
                            Models.DB.Profile newProfile = _mapper.Map<Models.DB.Profile>(registerDto);
                            newProfile.AppUser = appUser;
                            newProfile.Id = user.Id;
                            _context.Profiles.Add(newProfile);
                            _context.SaveChanges();
                            NewProfileDto createdProfile = _mapper.Map<NewProfileDto>(_context.Profiles.First(it => it.Id == appUser.Id));
                            return Ok(createdProfile);
                        }
                        else return StatusCode(500, "Ошибка создания пользователя");
                    }
                    else return StatusCode(500, roleResult.Errors.FirstOrDefault().Description);
                }
                else
                {
                    var error = createdUser.Errors.FirstOrDefault();
                    if (error != null)
                        if (error.Code == "DuplicateUserName")
                            return BadRequest("Такой пользователь уже есть");
                    return StatusCode(500, error);
                }
            }
            catch (Exception e)
            {
                var json = JsonConvert.SerializeObject(e)!;
                return StatusCode(500, e);
            }
        }

        [SwaggerOperation(Summary = "Авторизация в системе")]
        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var appUser = await _userManager.FindByEmailAsync(loginDto.Email.ToLower());
            var userRoles = await _userManager.GetRolesAsync(appUser);

            if (appUser == null) return Unauthorized("Такого пользователя нет в базе");

            var result = await _signInManager.CheckPasswordSignInAsync(appUser, loginDto.Password, false);

            if (!result.Succeeded) return Unauthorized("Неверный пароль");

            var user = _context.Profiles.FirstOrDefault(u => u.Id == appUser.Id);

            NewProfileDto profile = _mapper.Map<NewProfileDto>(user);

            profile.Token = _tokenService.CreateToken(appUser, userRoles);

            return Ok(profile);
        }

        [SwaggerOperation(Summary = "Получение информации об аккаунте")]
        [HttpGet]
        [Route("AccountInfo")]
        public async Task<ActionResult<ProfileInfoDto>> AccountInfo()
        {
            try
            {
                var appUser = await _userManager.FindByNameAsync(User.Identity.Name);
                var userRoles = await _userManager.GetRolesAsync(appUser);
                if (appUser == null || userRoles == null)
                {
                    return BadRequest("Пользователь не найден");
                }
                var user = _context.Profiles.Include(u => u.AppUser).FirstOrDefault(u => u.Id == appUser.Id);
                if (user is null)
                {
                    return StatusCode(401);
                }
                ProfileInfoDto infoDto = _mapper.Map<ProfileInfoDto>(user);
                infoDto.Email = appUser.Email;
                infoDto.Role = userRoles.ToList();
                return Ok(infoDto);
            }
            catch (Exception e)
            {
                var json = JsonConvert.SerializeObject(e)!;
                return StatusCode(500, e);
            }
        }

        [SwaggerOperation(Summary = "Назначить роли")]
        [HttpPatch]
        [Route("AssignRoles")]
        [Authorize(Roles = "Администратор")]
        public async Task<IActionResult> AssignRoles([FromHeader(Name = "roles")] List<string> roles, [FromHeader(Name = "userId")] Guid userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if(user == null) return BadRequest("Пользователь не найден");
                
                // Проверяем существование всех указанных ролей
                var existingRoles = await _roleManager.Roles
                    .Where(r => roles.Contains(r.NormalizedName))
                    .Select(r => r.NormalizedName)
                    .ToListAsync();

                var invalidRoles = roles.Except(existingRoles).ToList();
                if (invalidRoles.Any())
                    return BadRequest($"Несуществующие роли: {string.Join(", ", invalidRoles)}");

                // Получаем текущие роли пользователя
                var currentRoles = await _userManager.GetRolesAsync(user);

                // Удаляем роли, которые не указаны в запросе
                var rolesToRemove = currentRoles.Except(roles).ToList();
                if (rolesToRemove.Any())
                {
                    await _userManager.RemoveFromRolesAsync(user, rolesToRemove);
                }

                // Добавляем новые роли
                var rolesToAdd = roles.Except(currentRoles).ToList();
                if (rolesToAdd.Any())
                {
                    await _userManager.AddToRolesAsync(user, rolesToAdd);
                }

                _context.SaveChanges();
                return Ok($"Роли пользователя {user.UserName} успешно обновлены");

            }
            catch (Exception e)
            {
                var json = JsonConvert.SerializeObject(e)!;
                return StatusCode(500, e);
            }
        }
    }
}
