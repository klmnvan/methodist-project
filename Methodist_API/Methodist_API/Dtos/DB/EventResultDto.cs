using Microsoft.AspNetCore.Mvc;

namespace Methodist_API.Dtos.DB
{
    public class EventResultDto
    {
        public Guid Id { get; set; }
        public Guid EventId { get; set; }
        public string? FileName { get; set; }
        public Guid OwnerTypeId { get; set; }
        public string Result { get; set; } = String.Empty;
    }

}
