using Methodist_API.Models.DB;

namespace Methodist_API.Dtos.Patch
{
    public class PatchProfileDto : PatchDtoBase
    {
        public string FirstName { get; set; } = String.Empty;
        public string LastName { get; set; } = String.Empty;
        public string Patronymic { get; set; } = String.Empty;
        public string PhoneNumber { get; set; } = String.Empty;
        public Guid? MC_id { get; set; }
        public string? ImageUrl { get; set; } = null;
    }
}
