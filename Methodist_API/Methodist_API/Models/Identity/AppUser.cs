using Methodist_API.Models.DB;
using Microsoft.AspNetCore.Identity;

namespace Methodist_API.Models.Identity
{
    public class AppUser : IdentityUser<Guid>
    {
        public Profile ProfileNavigation { get; set; }

        public AppUser()
        {
            Id = Guid.NewGuid();
            SecurityStamp = Guid.NewGuid().ToString();
        }

        public AppUser(string userName) : this()
        {
            UserName = userName;
        }
    }

}
