using Newtonsoft.Json;

namespace Methodist_API.Models.DB
{
    public class MethodicalСommittee
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public Guid? HeadId { get; set; }

        [JsonIgnore]
        public Profile? Profile { get; set; }

        [JsonIgnore]
        public ICollection<Profile> Profiles { get; set; } = new List<Profile>();
    }

}
