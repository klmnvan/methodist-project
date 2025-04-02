using Newtonsoft.Json;

namespace Methodist_API.Models.DB
{
    public class FileEvent
    {
        public Guid Id { get; set; }
        public Guid EventId { get; set; }
        public string FileName { get; set; }

        [JsonIgnore]
        public Event Event { get; set; }
    }

}
