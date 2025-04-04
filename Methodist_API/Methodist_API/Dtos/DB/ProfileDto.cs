namespace Methodist_API.Dtos.DB
{
    public class ProfileDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = String.Empty;
        public string LastName { get; set; } = String.Empty;
        public string Patronymic { get; set; } = String.Empty;
        public Guid? MC_id { get; set; }
        public string? ImageUrl { get; set; } = null;
    }
}
