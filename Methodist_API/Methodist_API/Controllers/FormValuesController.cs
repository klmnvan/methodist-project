using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Methodist_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FormValuesController : ControllerBase
    {
        List<string> eventForms = new()
        {
            "Конкурс",
            "Конференция",
            "Фестиваль",
            "Семинар",
            "Мастер-класс",
            "Тренинг",
            "Вебинар",
            "Олимпиада",
            "Викторина",
            "Соревнование",
            "Открытый урок"
        };
        List<string> eventStatuses = new()
        {
            "Международное",
            "Всероссийское",
            "Региональное",
            "Городское",
            "Областное",
            "Колледжное",
        };
        List<string> eventResults = new()
        {
            "Подтверждающий документ не предусмотрен (или мероприятие еще не свершилось)",
            "Диплом 1 степени",
            "Диплом 2 степени",
            "Диплом 3 степени",
            "Диплом участника (без степеней)",
            "Благодарственное письмо",
            "Грамота",
            "Свидетельство",
            "Сертификат",
            "Участие (без подтвердительного документа)"
        };
        List<string> participationForms = new() { "Очное", "Заочное", "Дистанционное" };

        [SwaggerOperation(Summary = "Получить список возможных форм мероприятий")]
        [HttpGet("GetEventForms")]
        [Authorize]
        public async Task<ActionResult<List<string>>> GetEventForms()
        {
            return Ok(eventForms);
        }

        [SwaggerOperation(Summary = "Получить список возможных статусов мероприятий")]
        [HttpGet("GetEventStatuses")]
        [AllowAnonymous]
        public async Task<ActionResult<List<string>>> GetEventStatuses()
        {
            return Ok(eventStatuses);
        }

        [SwaggerOperation(Summary = "Получить список возможных результатов")]
        [HttpGet("GetEventResults")]
        [AllowAnonymous]
        public async Task<ActionResult<List<string>>> GetEventResults()
        {
            return Ok(eventResults);
        }

        [SwaggerOperation(Summary = "Получить список возможных форм участия")]
        [HttpGet("GetParticipationForms")]
        [AllowAnonymous]
        public async Task<ActionResult<List<string>>> GetParticipationForms()
        {
            return Ok(participationForms);
        }
    }
}
