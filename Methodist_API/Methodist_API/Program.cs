using Methodist_API.Data;
using Methodist_API.Interfaces;
using Methodist_API.Models.Identity;
using Methodist_API.Profiles;
using Methodist_API.Repositories;
using Methodist_API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using System.Text;
using Methodist_API.Dtos.Patch;
using AutoMapper;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", builder =>
    {
        builder.WithOrigins("http://localhost:5173")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
        .SetPreflightMaxAge(TimeSpan.FromHours(1));
    });
});

builder.Services.AddAutoMapper(typeof(MappingProfiles));

builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ContractResolver = new PatchRequestContractResolver();
    options.SerializerSettings.DateFormatString = "yyyy-MM-ddTHH:mm:ss.fffZ"; // Формат с миллисекундами
});

//для извлечения базового URL
builder.Services.AddHttpContextAccessor();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(option =>
{
    option.EnableAnnotations();
    option.SwaggerDoc("v1", new OpenApiInfo { Title = "Methodist API", Version = "v1", Description = "API для информационной системы Methodist" });
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Введите действительный токен",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    option.AddSecurityRequirement(new OpenApiSecurityRequirement 
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new List<string>()
        }
    });
    option.MapType<DateOnly>(() => new OpenApiSchema
    {
        Type = "string",
        Format = "date",
        Example = new OpenApiString("2022-01-01")
    });
});

builder.Services.AddDbContext<MKDbContext>(options =>
{
    //options.UseNpgsql(builder.Configuration.GetConnectionString("MKLocal"));
    options.UseNpgsql(builder.Configuration.GetConnectionString("NGK"));
});

builder.Services.AddScoped<TokenValidationFilter>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IEventRepository, EventRepository>();
builder.Services.AddScoped<IMKRepository, MKRepository>();
builder.Services.AddScoped<IProfileRepository, ProfileRepository>();
builder.Services.AddScoped<IFileUsersRepository, FileUsersRepository>();

builder.Services.AddIdentity<AppUser, Role>(options =>
{
    options.Password.RequiredLength = 8;
    options.Password.RequireDigit = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
    options.User.RequireUniqueEmail = true;
})
    .AddRoles<Role>()
    .AddEntityFrameworkStores<MKDbContext>()
    .AddDefaultTokenProviders();

var validIssuer = builder.Configuration.GetValue<string>("JWT:Issuer");
var validAudience = builder.Configuration.GetValue<string>("JWT:Audience");
var symmetricSecurityKey = builder.Configuration.GetValue<string>("JWT:SigningKey");

builder.Services.AddAuthentication(options =>  // схема аутентификации - с помощью jwt-токенов
{
    options.DefaultAuthenticateScheme =
    options.DefaultChallengeScheme =
    options.DefaultScheme =
    options.DefaultForbidScheme =
    options.DefaultSignInScheme =
    options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options => // подключение аутентификации с помощью jwt-токенов;
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.IncludeErrorDetails = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ClockSkew = TimeSpan.Zero,
        ValidateIssuer = true,
        ValidateLifetime = true,
        ValidateAudience = true,
        ValidIssuer = validIssuer,
        ValidAudience = validAudience,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["JWT:SigningKey"])
        )
    };
    options.Events = new JwtBearerEvents
    {
        OnChallenge = async context =>
        {
            // Call this to skip the default logic and avoid using the default response
            context.HandleResponse();

            var httpContext = context.HttpContext;
            var statusCode = StatusCodes.Status401Unauthorized;

            var routeData = httpContext.GetRouteData();
            var actionContext = new ActionContext(httpContext, routeData, new ActionDescriptor());

            var factory = httpContext.RequestServices.GetRequiredService<ProblemDetailsFactory>();
            var problemDetails = factory.CreateProblemDetails(httpContext, statusCode);

            var result = new ObjectResult(problemDetails) { StatusCode = statusCode };
            await result.ExecuteResultAsync(actionContext);
        },
        OnTokenValidated = async context =>
        {
            // Дополнительная проверка SecurityStamp
            var userManager = context.HttpContext.RequestServices.GetRequiredService<UserManager<AppUser>>();
            var userId = context.Principal?.FindFirstValue(ClaimTypes.NameIdentifier);
            var tokenStamp = context.Principal?.FindFirstValue("SecurityStamp");

            if (userId == null || tokenStamp == null)
            {
                context.Fail("Invalid token claims");
                return;
            }

            var user = await userManager.FindByIdAsync(userId);
            if (user == null || user.SecurityStamp != tokenStamp)
            {
                context.Fail("Token revoked");
                return;
            }
        },
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            if (!string.IsNullOrEmpty(accessToken))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});
builder.Services.AddAuthorization(options =>
{
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
}); //для того, чтобы для каждого запроса нужна была атворизация

var app = builder.Build();

app.UseCors("ReactPolicy");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<MKDbContext>();
        var userManager = services.GetRequiredService<UserManager<AppUser>>();
        var roleManager = services.GetRequiredService<RoleManager<Role>>();
        var mapper = services.GetRequiredService<IMapper>();

        // Применяем миграции
        context.Database.Migrate();

        // Инициализируем базу данных
        await DbInitializer.InitializeAsync(context, userManager, roleManager, mapper);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
        Console.WriteLine($"Ошибка при инициализации БД: {ex.Message}");
    }
}


app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.UseStaticFiles();

app.Run();
