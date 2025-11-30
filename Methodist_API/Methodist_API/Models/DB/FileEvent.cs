using Newtonsoft.Json;

namespace Methodist_API.Models.DB
{
    public class FileEvent
    {
        public Guid Id { get; set; }
        public Guid EventId { get; set; }
        public string? FileName { get; set; }
        public Guid OwnerTypeId { get; set; }
        public string Result { get; set; } = String.Empty;

        [JsonIgnore]
        public Event Event { get; set; }

        [JsonIgnore]
        public ResultOwnerType ResultOwnerType { get; set; }
    }

}
