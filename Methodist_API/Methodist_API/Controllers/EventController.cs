using AutoMapper;
using Methodist_API.Dtos.Account;
using Methodist_API.Dtos.CreateEntity;
using Methodist_API.Dtos.DB;
using Methodist_API.Dtos.Patch;
using Methodist_API.Interfaces;
using Methodist_API.Models.DB;
using Methodist_API.Models.Identity;
using Methodist_API.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Swashbuckle.AspNetCore.Annotations;
using static System.Net.Mime.MediaTypeNames;
using Profile = Methodist_API.Models.DB.Profile;

namespace Methodist_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EventController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IEventRepository _eventRepository;
        private readonly UserManager<AppUser> _userManager;
        private static string packageName = "Events";
        private string uploadPath = Path.Combine($"{Directory.GetCurrentDirectory()}\\Uploads", packageName);
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IFileUsersRepository _fileUsersRepository;

        public EventController(IMapper mapper, IEventRepository eventRepository, UserManager<AppUser> userManager, IHttpContextAccessor httpContextAccessor,
            IFileUsersRepository fileUsersRepository)
        {
            _mapper = mapper;
            _eventRepository = eventRepository;
            _userManager = userManager;
            _httpContextAccessor = httpContextAccessor;
            _fileUsersRepository = fileUsersRepository;
            Directory.CreateDirectory(uploadPath);
        }

        //http://localhost/Uploads/Events
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

        [SwaggerOperation(Summary = "Получить все мероприятия по доступности роли")]
        [HttpGet("GetEvents")]
        public async Task<ActionResult<List<EventDetailsDto>>> GetEvents()
        {
            try
            {
                var appUser = await _userManager.FindByNameAsync(User.Identity.Name);
                if (appUser == null) return Unauthorized();
                var userRoles = await _userManager.GetRolesAsync(appUser);
                List<EventDetailsDto> listResult = new();
                List<Event> listEntity = new();
                if (userRoles.ToList().Contains("Администратор") ||
                    userRoles.ToList().Contains("Руководитель корпуса") ||
                    userRoles.ToList().Contains("Представитель научно-методического центра"))
                {
                    listEntity = _eventRepository.SelectAll();
                }
                else if(userRoles.ToList().Contains("Председатель методической комиссии"))
                {
                    listEntity = _eventRepository.SelectByIdMC(appUser.Id);
                }
                else if (userRoles.ToList().Contains("Член методической комиссии"))
                {
                    listEntity = _eventRepository.SelectByIdProfile(appUser.Id);
                }

                listEntity.ForEach(e =>
                {
                    EventDetailsDto newEvent = _mapper.Map<EventDetailsDto>(e);
                    newEvent.TypeOfEvent = e.TypeOfEvent;
                    var profile = _mapper.Map<ProfileDto>(e.Profile);
                    profile.MC = e.Profile.MethodicalСommittee;
                    profile.Email = appUser.Email;
                    profile.Roles = userRoles.ToList();
                    newEvent.Profile = profile;
                    listResult.Add(newEvent);
                });

                return Ok(_mapper.Map<List<EventDetailsDto>>(listResult));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [SwaggerOperation(Summary = "Изменить часть мероприятия")]
        [HttpPatch("UpdatePart")]
        public async Task<ActionResult<Event>> UpdatePart([FromHeader(Name = "EventId")] Guid eventId, PatchEventDto dto)
        {
            try
            {
                var appUser = await _userManager.FindByNameAsync(User.Identity.Name);
                if (appUser == null)
                {
                    return Unauthorized();
                }
                var entity = _eventRepository.UpdatePart(eventId, dto);
                return Ok(entity);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [SwaggerOperation(Summary = "Создать мероприятие")]
        [HttpPost("Create")]
        public async Task<ActionResult<EventDto>> Create([FromBody] CreateEventDto newEvent)
        {
            try
            {
                var appUser = await _userManager.FindByNameAsync(User.Identity.Name);
                if (appUser == null)
                {
                    return Unauthorized();
                }
                if (!_eventRepository.TypeIsExists(newEvent.TypeId))
                {
                    return BadRequest("Тип мероприятия заполнен некорректно");
                }
                var entity = _eventRepository.Insert(newEvent, appUser.Id);
                var result = _mapper.Map<EventDto>(entity);
                result.TypeOfEvent = entity.TypeOfEvent;
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [SwaggerOperation(Summary = "Удалить мероприятие")]
        [HttpDelete("Remove")]
        public async Task<ActionResult> Remove([FromHeader(Name = "EventId")] Guid eventId)
        {
            try
            {
                var listEntity = _eventRepository.Delete(eventId);
                return Ok($"Мероприятие было удалено");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [SwaggerOperation(Summary = "Загрузить файлы к мероприятию")]
        [HttpPost("UploadFiles")]
        public async Task<IActionResult> UploadFiles(List<IFormFile> files, [FromHeader(Name = "idEvent")] Guid idEvent)
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
                if (files.IsNullOrEmpty())
                {
                    return BadRequest("Файл загрузки не передан");
                }

                foreach (var file in files)
                {

                    // путь к файлу
                    string imageName = $"{Guid.NewGuid()}_{file.FileName}";
                    var filePath = Path.Combine(uploadPath, imageName);

                    // сохраняем файл в папку Uploads
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(fileStream);
                    }

                    _fileUsersRepository.Insert(idEvent, imageName);
                }
                return Ok($"Файлы успешно загружены");
            }
            catch (Exception e)
            {
                var json = JsonConvert.SerializeObject(e)!;
                return StatusCode(500, e);
            }
        }

    }
}
