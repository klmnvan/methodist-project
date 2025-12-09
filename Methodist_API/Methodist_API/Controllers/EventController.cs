using AutoMapper;
using Methodist_API.Data;
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
using System.Text.Json;
using static System.Net.Mime.MediaTypeNames;
using JsonException = System.Text.Json.JsonException;
using JsonSerializer = System.Text.Json.JsonSerializer;
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
        private readonly MKDbContext _context;

        public EventController(IMapper mapper, IEventRepository eventRepository, UserManager<AppUser> userManager, IHttpContextAccessor httpContextAccessor,
            IFileUsersRepository fileUsersRepository, MKDbContext context)
        {
            _mapper = mapper;
            _eventRepository = eventRepository;
            _userManager = userManager;
            _httpContextAccessor = httpContextAccessor;
            _fileUsersRepository = fileUsersRepository;
            _context = context;
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
                    newEvent.Results = _mapper.Map<List<EventResultDto>>(e.Results);
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

        [SwaggerOperation(Summary = "Получить файл результата")]
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

        [SwaggerOperation(Summary = "Получить все категории мероприятий")]
        [HttpGet("GetTypeOfEvents")]
        public async Task<ActionResult<List<TypeOfEventDto>>> GetTypeOfEvents()
        {
            try
            {
                var appUser = await _userManager.FindByNameAsync(User.Identity.Name);
                if (appUser == null) return Unauthorized();
                var types = _eventRepository.SelectAllTypes();
                return Ok(_mapper.Map<List<TypeOfEventDto>>(types));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [SwaggerOperation(Summary = "Получить все типы владелцев для результатов")]
        [HttpGet("GetOwnerTypeByResults")]
        public async Task<ActionResult<List<ResultOwnerTypeDto>>> GetOwnerTypeByResults()
        {
            try
            {
                var appUser = await _userManager.FindByNameAsync(User.Identity.Name);
                if (appUser == null) return Unauthorized();
                var types = _eventRepository.SelectOwnerTypeByResults();
                return Ok(_mapper.Map<List<ResultOwnerTypeDto>>(types));
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
        public async Task<ActionResult<EventDetailsDto>> Create([FromBody] CreateEventDto newEvent)
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
                var result = _mapper.Map<EventDetailsDto>(entity);
                result.TypeOfEvent = entity.TypeOfEvent;
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [SwaggerOperation(Summary = "Создать мероприятие")]
        [HttpPost("CreateEventWithFiles")]
        public async Task<ActionResult<EventDetailsDto>> CreateEventWithFiles(
            [FromForm] string newEventJson, // Получаем как строку из формы
            [FromForm] List<IFormFile> files)
        {
            try
            {
                // Десериализуем JSON вручную
                var newEvent = JsonSerializer.Deserialize<CreateEventWithFilesDto>(
                    newEventJson,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    }
                );
                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        var appUser = await _userManager.FindByNameAsync(User.Identity.Name);
                        if (appUser == null) return Unauthorized();
                        if (!_eventRepository.TypeIsExists(newEvent.TypeId)) return BadRequest("Тип мероприятия заполнен некорректно");
                        if (!ModelState.IsValid) return BadRequest(ModelState);
                        var fileDictionary = new Dictionary<string, IFormFile>(StringComparer.OrdinalIgnoreCase);
                        foreach (var file in files)
                        {
                            // Используем только имя файла (без пути, если он есть)
                            var fileName = Path.GetFileName(file.FileName);
                            if (!string.IsNullOrEmpty(fileName))
                            {
                                fileDictionary[fileName] = file;
                            }
                        }
                        // Проверяем, что все указанные файлы действительно пришли
                        var missingFiles = new List<string>();
                        foreach (var resEvent in newEvent.Results)
                            if (!string.IsNullOrEmpty(resEvent.FileName) && !fileDictionary.ContainsKey(resEvent.FileName))
                                missingFiles.Add(resEvent.FileName);

                        if (missingFiles.Any())
                            return BadRequest($"Следующие файлы не были загружены: {string.Join(", ", missingFiles)}");
                        //создание мероприятия
                        var _event = _mapper.Map<Event>(newEvent);
                        _event.ProfileId = appUser.Id;
                        var itemEvent = _context.Events.Add(_event);
                        await _context.SaveChangesAsync();

                        foreach (var resEvent in newEvent.Results)
                        {
                            var _result = _mapper.Map<EventResult>(resEvent);
                            if (!string.IsNullOrEmpty(resEvent.FileName) &&
                        fileDictionary.TryGetValue(resEvent.FileName, out var uploadedFile))
                            {
                                string imageName = $"{Guid.NewGuid()}_{resEvent.FileName}";
                                var filePath = Path.Combine(uploadPath, imageName);

                                // сохраняем файл в папку Uploads
                                using (var fileStream = new FileStream(filePath, FileMode.Create))
                                {
                                    await uploadedFile.CopyToAsync(fileStream);
                                }
                                _result.FileName = imageName;
                            }
                            else
                            {
                                _result.FileName = null; // Если файл не был загружен
                            }
                            _result.EventId = itemEvent.Entity.Id;
                            _context.FileEvents.Add(_result);
                        }

                        await _context.SaveChangesAsync();
                        await transaction.CommitAsync();

                        var createdEventWithFiles = _context.Events
                            .Include(it => it.TypeOfEvent)
                            .Include(it => it.Profile).ThenInclude(it => it.MethodicalСommittee)
                            .Include(it => it.Results)
                            .Single(e => e.Id == itemEvent.Entity.Id);

                        var result = _mapper.Map<EventDetailsDto>(createdEventWithFiles);
                        return Ok(result);
                    }
                    catch (Exception ex)
                    {
                        //откат транзакции
                        await transaction.RollbackAsync();
                        return StatusCode(500, ex.Message);
                    }
                }

            }
            catch (JsonException ex)
            {
                return BadRequest($"Ошибка десериализации JSON: {ex.Message}");
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
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                
                var appUser = await _userManager.FindByNameAsync(User.Identity.Name);
                var userRoles = await _userManager.GetRolesAsync(appUser);

                if (appUser == null || userRoles == null)
                    return BadRequest("Пользователь не найден");
                
                if (files.IsNullOrEmpty())
                    return BadRequest("Файл загрузки не передан");

                var eventEntity = await _context.Events
                    .Include(e => e.Results)
                    .FirstOrDefaultAsync(e => e.Id == idEvent);

                if (eventEntity == null) return NotFound($"Мероприятие с ID {idEvent} не найдено");

                //if (eventEntity.ProfileId != appUser.Id) return Forbid("У вас нет прав для добавления файлов к этому мероприятию"); - доработать

                var expectedFileNames = eventEntity.Results
                    .Where(r => !string.IsNullOrEmpty(r.FileName))
                    .Select(r => r.FileName)
                    .Distinct(StringComparer.OrdinalIgnoreCase)
                    .ToList();

                // Словарь для быстрого поиска файлов по имени
                var uploadedFiles = new Dictionary<string, IFormFile>(StringComparer.OrdinalIgnoreCase);
                foreach (var file in files)
                {
                    var fileName = Path.GetFileName(file.FileName);
                    if (!string.IsNullOrEmpty(fileName))
                    {
                        uploadedFiles[fileName] = file;
                    }
                }

                // Проверяем, что все ожидаемые файлы загружены
                var missingFiles = expectedFileNames
                    .Where(expected => !uploadedFiles.ContainsKey(expected))
                    .ToList();

                if (missingFiles.Any())
                {
                    return BadRequest($"Следующие файлы не были загружены: {string.Join(", ", missingFiles)}");
                }

                // Обрабатываем каждый результат мероприятия
                foreach (var result in eventEntity.Results)
                {
                    if (!string.IsNullOrEmpty(result.FileName) &&
                        uploadedFiles.TryGetValue(result.FileName, out var uploadedFile))
                    {
                        // Генерируем уникальное имя для сохранения
                        string uniqueFileName = $"{Guid.NewGuid()}_{result.FileName}";
                        var filePath = Path.Combine(uploadPath, uniqueFileName);

                        // Сохраняем файл
                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            await uploadedFile.CopyToAsync(fileStream);
                        }

                        // Обновляем имя файла в результате
                        result.FileName = uniqueFileName;
                    }
                }

                await _context.SaveChangesAsync();
                return Ok(new
                {
                    message = "Файлы успешно загружены и привязаны к результатам",
                    eventId = idEvent,
                    uploadedCount = files.Count
                });
            }
            catch (Exception e)
            {
                var json = JsonConvert.SerializeObject(e)!;
                return StatusCode(500, e);
            }
        }

    }
}
