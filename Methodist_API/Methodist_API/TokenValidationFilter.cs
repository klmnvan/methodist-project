using Methodist_API.Models.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using Methodist_API.Data;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

public class TokenValidationFilter : IAsyncActionFilter
{
    private readonly MKDbContext _context;

    public TokenValidationFilter(MKDbContext context)
    {
        _context = context;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        // Пропускаем анонимные запросы
        if (context.HttpContext.User.Identity?.IsAuthenticated != true)
        {
            await next();
            return;
        }

        var userIdClaim = context.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            context.Result = new UnauthorizedObjectResult("Invalid token");
            return;
        }

        // Получаем SecurityStamp из токена
        var tokenStamp = context.HttpContext.User.FindFirstValue("SecurityStamp")
                      ?? context.HttpContext.User.FindFirstValue("TokenVersion");

        // Асинхронно проверяем актуальность штампа
        var userStamp = await _context.Users
            .AsNoTracking() // Оптимизация - не отслеживаем сущность
            .Where(u => u.Id == userId)
            .Select(u => u.SecurityStamp) // Или u.TokenVersion
            .FirstOrDefaultAsync();

        if (userStamp == null || userStamp != tokenStamp)
        {
            context.Result = new UnauthorizedObjectResult("Token revoked");
            return;
        }

        await next();
    }
}