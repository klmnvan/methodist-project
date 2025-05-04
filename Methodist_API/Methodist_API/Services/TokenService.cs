using Methodist_API.Interfaces;
using Methodist_API.Models.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace Methodist_API.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;
        private readonly SymmetricSecurityKey _key;

        public TokenService(IConfiguration config)
        {
            _config = config;
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:SigningKey"]));
        }

        public string CreateAccessToken(AppUser user, IList<string> roles)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Email),
                new Claim("SecurityStamp", user.SecurityStamp)
            };

            // Добавляем ВСЕ роли пользователя в claims
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Issuer = _config["JWT:Issuer"],
                Audience = _config["JWT:Audience"],
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddMinutes(30),
                SigningCredentials = creds,
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        public string CreateRefreshToken(Guid userId)
        {
            var payload = new
            {
                UserId = userId,
                TokenId = Guid.NewGuid(),
                Expires = DateTime.UtcNow.AddDays(7).Ticks,
                Salt = Convert.ToBase64String(RandomNumberGenerator.GetBytes(16))
            };
            return Convert.ToBase64String(JsonSerializer.SerializeToUtf8Bytes(payload));
        }

        public bool ValidateRefreshToken(string refreshToken, Guid userId, out DateTime? expiryDate)
        {
            expiryDate = null;

            try
            {
                // 1. Декодируем Base64
                var decodedBytes = Convert.FromBase64String(refreshToken);
                var payload = JsonSerializer.Deserialize<RefreshTokenPayload>(decodedBytes);

                // 2. Проверяем структуру
                if (payload == null || payload.UserId != userId || payload.Expires == 0) return false;

                // 3. Проверяем срок действия
                expiryDate = new DateTime(payload.Expires, DateTimeKind.Utc);
                if (expiryDate < DateTime.UtcNow) return false;

                // 4. Дополнительные проверки (опционально)
                if (string.IsNullOrEmpty(payload.Salt) || payload.Salt.Length != 24) return false;

                return true;
            }
            catch
            {
                // Ловим все исключения (FormatException, JsonException и т.д.)
                return false;
            }
        }

        /*//Создание токена
        public string CreateToken(AppUser user, IList<string> roles)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Name, user.Email),
                new Claim(JwtRegisteredClaimNames.GivenName, user.UserName),
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            };

            // Добавляем ВСЕ роли пользователя в claims
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(31), //токен на * период
                SigningCredentials = creds,
                Issuer = _config["JWT:Issuer"],
                Audience = _config["JWT:Audience"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }*/

    }

}
