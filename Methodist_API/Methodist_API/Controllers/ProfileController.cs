using AutoMapper;
using Methodist_API.Dtos.DB;
using Methodist_API.Dtos.Patch;
using Methodist_API.Interfaces;
using Methodist_API.Models.DB;
using Methodist_API.Models.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Swashbuckle.AspNetCore.Annotations;

namespace Methodist_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IProfileRepository _profileRepository;
        private readonly UserManager<AppUser> _userManager;
        private static string packageName = "Profiles";
        private string uploadPath = Path.Combine($"{Directory.GetCurrentDirectory()}\\Uploads", packageName);
        private readonly IHttpContextAccessor _httpContextAccessor;
        public ProfileController(IMapper mapper, IProfileRepository profileRepository, UserManager<AppUser> userManager,
            IHttpContextAccessor httpContextAccessor)
        {
            _mapper = mapper;
            _profileRepository = profileRepository;
            _userManager = userManager;
            _httpContextAccessor = httpContextAccessor;
            // создаем папку для хранения файлов, если она не существует
            Directory.CreateDirectory(uploadPath);
        }

        //http://localhost/Uploads/Profiles
        private string BaseUrlWithPackage => $"{BaseUrl}/Uploads/{packageName}"; // Формирование базового URL

        //http://localhost
        private string BaseUrl
        {
            get
            {
                var request = _httpContextAccessor.HttpContext.Request;
                return $"{request.Scheme}://{request.Host}";
            }
        }

        [SwaggerOperation(Summary = "Получить профиль пользователя")]
        [HttpGet("GetProfile")]
        public async Task<ActionResult<ProfileDto>> GetProfile()
        {
            try
            {
                var appUser = await _userManager.FindByNameAsync(User.Identity.Name);
                var userRoles = await _userManager.GetRolesAsync(appUser);
                if (appUser == null || userRoles == null)
                {
                    return BadRequest("Пользователь не найден");
                }
                var profile = _profileRepository.SelectByIdProfile(appUser.Id);
                var dto = _mapper.Map<ProfileDto>(profile);
                dto.MC = profile.MethodicalСommittee;
                dto.Email = appUser.Email;
                dto.Roles = userRoles.ToList();
                return Ok(dto);
            }
            catch (Exception e)
            {
                var json = JsonConvert.SerializeObject(e)!;
                return StatusCode(500, e);
            }
        }

        [SwaggerOperation(Summary = "Загрузить фото профиля")]
        [HttpPatch("UploadImage")]
        public async Task<IActionResult> UploadImage(IFormFile image)
        {
            try
            {
                //ModelState.IsValid используется для проверки, прошла ли модель валидацию. Если в модели есть ошибки, это свойство будет равно false.
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var appUser = await _userManager.FindByNameAsync(User.Identity.Name);
                var userRoles = await _userManager.GetRolesAsync(appUser);
                if (appUser == null || userRoles == null)
                {
                    return BadRequest("Пользователь не найден");
                }
                if (image == null || image.Length == 0)
                {
                    return BadRequest("Файл загрузки не передан");
                }

                // путь к файлу
                string imageName = $"{Guid.NewGuid()}_{image.FileName}";
                var filePath = Path.Combine(uploadPath, imageName);

                //Получаем текущее название картинки и проверяем, есть ли такое сейчас в API
                var profileLastImage = _profileRepository.SelectByIdProfile(appUser.Id).ImageUrl;
                if (!profileLastImage.IsNullOrEmpty()) 
                {

                    // Определение пути к файлу
                    var uploadsFolderPath = Path.Combine($"{Directory.GetCurrentDirectory()}\\Uploads", packageName);
                    var filePathLastImage = Path.Combine(uploadsFolderPath, profileLastImage);

                    // Проверка, существует ли файл
                    if (System.IO.File.Exists(filePathLastImage))
                    {
                        System.IO.File.Delete(filePathLastImage);
                    }
                }

                // сохраняем файл в папку Uploads
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(fileStream);
                }

                //сюда url
                _profileRepository.UpdateImage(appUser.Id, imageName);
                return Ok($"Изображение успешно загружено: {BaseUrlWithPackage}/{imageName}");
            }
            catch (Exception e)
            {
                var json = JsonConvert.SerializeObject(e)!;
                return StatusCode(500, e);
            }
        }

        [SwaggerOperation(Summary = "Получить фото")]
        [HttpGet("Uploads/{fileName}")]
        [AllowAnonymous]
        public async Task<IActionResult> Uploads(string fileName)
        {
            // Определение пути к файлу
            var uploadsFolderPath = Path.Combine($"{Directory.GetCurrentDirectory()}\\Uploads", packageName);
            var filePath = Path.Combine(uploadsFolderPath, fileName);

            // Проверка, существует ли файл
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("Файл не найден.");
            }

            // Возвращаем файл
            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            return File(fileBytes, "application/octet-stream", fileName);
        }

        [SwaggerOperation(Summary = "Изменить часть профиля")]
        [HttpPatch("UpdatePart")]
        public async Task<ActionResult<Models.DB.Profile>> UpdatePart(PatchProfileDto dto)
        {
            try
            {
                var appUser = await _userManager.FindByNameAsync(User.Identity.Name);
                if (appUser == null)
                {
                    return Unauthorized();
                }
                var entity = _profileRepository.UpdatePart(appUser.Id, dto);
                return Ok(entity);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
