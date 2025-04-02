using Methodist_API.Models.DB;
using Microsoft.AspNetCore.Identity;

namespace Methodist_API.Models.Identity
{
    public class UserToken : IdentityUserToken<string> 
    {
        public UserToken() { }

        public string DeviceId { get; set; } = default!;
    }

}
