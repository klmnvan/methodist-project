using Methodist_API.Models.DB;

namespace Methodist_API.Dtos.CreateEntity
{
    public class CreateEventDto
    {
        public DateTime DateOfEvent { get; set; }
        public DateTime EndDateOfEvent { get; set; }
        public Guid TypeId { get; set; }
        public bool IsChecked { get; set; } = false;
        public bool IsApproved { get; set; } = false;
        public string Type { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string FormOfParticipation { get; set; } = string.Empty;
        public string FormOfEvent { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string QuantityOfHours { get; set; } = string.Empty;
        public string Result { get; set; } = string.Empty;
    }
}
