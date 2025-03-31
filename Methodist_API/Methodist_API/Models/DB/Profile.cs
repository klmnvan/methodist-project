using Methodist_API.Models.Identity;
using Newtonsoft.Json;

namespace Methodist_API.Models.DB
{
    public class Profile
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = String.Empty;
        public string LastName { get; set; } = String.Empty;
        public string Patronymic { get; set; } = String.Empty;
        public Guid MC_id { get; set; }

        [JsonIgnore]
        public AppUser AppUser { get; set; }

        [JsonIgnore]
        public MethodicalСommittee MethodicalСommittee { get; set; }

        [JsonIgnore]
        public ICollection<MethodicalСommittee> MethodicalСommittees { get; set; } = [];

        [JsonIgnore]
        public ICollection<Event> Events { get; set; } = [];
    }

}
