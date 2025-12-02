using Newtonsoft.Json;
using JsonIgnoreAttribute = System.Text.Json.Serialization.JsonIgnoreAttribute;

namespace Methodist_API.Models.DB
{
    public class Event
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime DateOfEvent { get; set; }
        public DateTime EndDateOfEvent { get; set; }
        public Guid TypeId { get; set; }
        public bool IsChecked { get; set; }
        public bool IsApproved { get; set; }
        public string Type { get; set; } = String.Empty;
        public string Name { get; set; } = String.Empty;
        public string FormOfParticipation { get; set; } = String.Empty;
        public string FormOfEvent { get; set; } = String.Empty;
        public string Status { get; set; } = String.Empty;
        public string Location { get; set; } = String.Empty;
        public string QuantityOfHours { get; set; } = String.Empty;
        public int? ParticipantsCount { get; set; } = 0;
        public Guid ProfileId { get; set; }

        [JsonIgnore]
        public TypeOfEvent TypeOfEvent {  get; set; }

        [JsonIgnore]
        public Profile Profile { get; set; }

        [JsonIgnore]
        public ICollection<EventResult> FileEvents { get; set; } = [];
    }
}
