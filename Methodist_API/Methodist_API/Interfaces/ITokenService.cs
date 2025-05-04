using Methodist_API.Models.Identity;

namespace Methodist_API.Interfaces
{
    public interface ITokenService
    {
        string CreateAccessToken(AppUser user, IList<string> roles);
        string CreateRefreshToken(Guid userId);
        bool ValidateRefreshToken(string refreshToken, Guid userId, out DateTime? expiryDate);
    }
}
