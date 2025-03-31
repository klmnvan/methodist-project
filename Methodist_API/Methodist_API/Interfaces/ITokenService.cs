using Methodist_API.Models.Identity;

namespace Methodist_API.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(AppUser user, string role);
    }
}
