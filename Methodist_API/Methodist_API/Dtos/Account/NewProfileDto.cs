namespace Methodist_API.Dtos.Account
{
    public class NewProfileDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = String.Empty;
        public string LastName { get; set; } = String.Empty;
        public string Patronymic { get; set; } = String.Empty;
        public Guid? MC_id { get; set; }
        public string Token { get; set; } = String.Empty;
    }
}
