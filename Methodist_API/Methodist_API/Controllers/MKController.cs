using AutoMapper;
using Methodist_API.Dtos.CreateEntity;
using Methodist_API.Interfaces;
using Methodist_API.Models.DB;
using Methodist_API.Models.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Methodist_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MKController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IMKRepository _mKRepository;
        private readonly UserManager<AppUser> _userManager;
        public MKController(IMapper mapper, IMKRepository mKRepository, UserManager<AppUser> userManager)
        {
            _mapper = mapper;
            _mKRepository = mKRepository;
            _userManager = userManager;
        }

        [SwaggerOperation(Summary = "Получить все методические комиссии")]
        [HttpGet("GetAll")]
        [AllowAnonymous]
        public async Task<ActionResult<List<Event>>> GetAll()
        {
            try
            {
                var listEntity = _mKRepository.Select();
                return Ok(listEntity);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [SwaggerOperation(Summary = "Назначить главу методической комиссии")]
        [HttpPatch("AppointHead")]
        public async Task<ActionResult> AppointHead(
            [FromHeader(Name = "MKId")] Guid MKId, 
            [FromHeader(Name = "ProfileId")] Guid? profileId) 
        {
            try
            {
                var listEntity = _mKRepository.UpdateHead(MKId, profileId);
                return Ok("Глава МК изменён");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [SwaggerOperation(Summary = "Добавить методическую комиссию")]
        [HttpPost("Create")]
        public async Task<ActionResult> Create([FromBody] CreateMKDto dto) 
        {
            try
            {
                var listEntity = _mKRepository.Insert(_mapper.Map<MethodicalСommittee>(dto));
                return Ok($"Методическая комиссия {dto.Name} была добавлена");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [SwaggerOperation(Summary = "Удалить методическую комиссию")]
        [HttpDelete("Remove")]
        public async Task<ActionResult> Remove([FromHeader(Name = "MKId")] Guid MKId)
        {
            try
            {
                var listEntity = _mKRepository.Delete(MKId);
                return Ok($"Методическая комиссия была удалена");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
