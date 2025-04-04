using AutoMapper;
using Methodist_API.Dtos.Account;
using Methodist_API.Dtos.CreateEntity;
using Methodist_API.Dtos.Patch;
using Methodist_API.Interfaces;
using Methodist_API.Models.DB;
using Methodist_API.Models.Identity;
using Methodist_API.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;
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

        public EventController(IMapper mapper, IEventRepository eventRepository, UserManager<AppUser> userManager)
        {
            _mapper = mapper;
            _eventRepository = eventRepository;
            _userManager = userManager;
        }

        [SwaggerOperation(Summary = "Получить все мероприятия пользователя")]
        [HttpGet("GetByIdProfile")]
        public async Task<ActionResult<List<Event>>> GetByIdProfile()
        {
            try
            {
                var appUser = await _userManager.FindByNameAsync(User.Identity.Name);
                if (appUser == null)
                {
                    return Unauthorized();
                }
                var listEntity = _eventRepository.SelectByIdProfile(appUser.Id);
                return Ok(listEntity);
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
        public async Task<ActionResult<Event>> Create([FromBody] CreateEventDto newEvent)
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
                return Ok(entity);
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

    }
}
