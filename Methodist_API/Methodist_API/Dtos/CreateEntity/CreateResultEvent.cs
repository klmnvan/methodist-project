namespace Methodist_API.Dtos.CreateEntity
{
    public class CreateResultEvent
    {
        public Guid OwnerTypeId { get; set; }
        public string Result { get; set; } = String.Empty;
        public IFormFile? file { get; set; }
    }
}
