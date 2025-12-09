using Methodist_API.Models.DB;

namespace Methodist_API.Dtos.DB
{
    public class EventDetailsDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime DateOfEvent { get; set; }
        public DateTime EndDateOfEvent { get; set; }
        public bool IsApproved { get; set; }
        public string Type { get; set; } = String.Empty;
        public string Name { get; set; } = String.Empty;
        public string FormOfParticipation { get; set; } = String.Empty;
        public string FormOfEvent { get; set; } = String.Empty;
        public string Status { get; set; } = String.Empty;
        public string Location { get; set; } = String.Empty;
        public string QuantityOfHours { get; set; } = String.Empty;
        public int? ParticipantsCount { get; set; } = 0;
        public ICollection<EventResultDto> Results { get; set; } = [];
        public ProfileDto Profile { get; set; }
        public TypeOfEvent TypeOfEvent { get; set; }
    }

}
