using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace Methodist_API.Dtos.Account
{
    public class LoginDto
    {
        [Required(ErrorMessage = "Не указана почта")]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Не указан пароль")]
        [Display(Name = "Пароль")]
        [DataType(DataType.Password)]
        [DefaultValue("12345678")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Не указан ID устройства")]
        [Display(Name = "Уникальный идентификатор устройства")]
        [DefaultValue("12345678")]
        public string Device { get; set; }
    }
}
