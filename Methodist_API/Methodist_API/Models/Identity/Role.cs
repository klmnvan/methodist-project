using Microsoft.AspNetCore.Identity;
using System.Xml.Linq;

namespace Methodist_API.Models.Identity
{

    public class Role : IdentityRole<Guid>
    {
        public Role()
        {
            Id = Guid.NewGuid();
        }

        public Role(string roleName) : this()
        {
            Name = roleName;
        }
    }

}
