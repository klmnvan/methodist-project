using Methodist_API.Models.DB;

namespace Methodist_API.Dtos.DB
{
    public class ProfileDto
    {
        public Guid Id { get; set; }
        public DateTime СreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string FirstName { get; set; } = String.Empty;
        public string LastName { get; set; } = String.Empty;
        public string Patronymic { get; set; } = String.Empty;
        public MethodicalСommittee MC { get; set; }
        public string? ImageUrl { get; set; } = null;
        public string Email { get; set; } = "";
        public List<string> Roles { get; set; } = new();
    }
}
