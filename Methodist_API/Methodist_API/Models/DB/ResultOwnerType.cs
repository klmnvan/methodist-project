using Newtonsoft.Json;

namespace Methodist_API.Models.DB
{
    public class ResultOwnerType
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = String.Empty;

        [JsonIgnore]
        public ICollection<FileEvent> Results { get; set; } = [];
    }

}
