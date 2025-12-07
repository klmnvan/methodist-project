using Methodist_API.Models.DB;

namespace Methodist_API.Dtos.DB
{
    public class TypeOfEventDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

}
