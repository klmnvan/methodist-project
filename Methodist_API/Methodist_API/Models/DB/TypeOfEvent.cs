using System.Text.Json.Serialization;

namespace Methodist_API.Models.DB
{
    public class TypeOfEvent
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = String.Empty;

        [JsonIgnore]
        public ICollection<Event> Events { get; set; } = [];
    }

}
