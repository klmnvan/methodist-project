namespace Methodist_API.Dtos.Account
{
    public class NewProfileDto
    {
        public Guid Id { get; set; }
        public string RefreshToken { get; set; } = String.Empty;
        public string AccessToken { get; set; } = String.Empty;
        public string FirstName { get; set; } = String.Empty;
        public string LastName { get; set; } = String.Empty;
        public string Patronymic { get; set; } = String.Empty;
        public Guid? MC_id { get; set; }
    }
}
