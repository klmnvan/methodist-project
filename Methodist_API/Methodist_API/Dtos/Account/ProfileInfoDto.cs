namespace Methodist_API.Dtos.Account
{
    public class ProfileInfoDto()
    {
        public string FirstName { get; set; } = String.Empty;
        public string LastName { get; set; } = String.Empty;
        public string Patronymic { get; set; } = String.Empty;
        public Guid? MC_id { get; set; }
        public List<string> Role { get; set; }
        public string Email { get; set; }
    }
}
