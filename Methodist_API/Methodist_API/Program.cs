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


var builder = WebApplication.CreateBuilder(args);

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
    options.UseNpgsql(builder.Configuration.GetConnectionString("Home"));
});

builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IEventRepository, EventRepository>();
builder.Services.AddScoped<IMKRepository, MKRepository>();
builder.Services.AddScoped<IProfileRepository, ProfileRepository>();

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
    options.Events = new JwtBearerEvents //Для создания кастомного сообщения о том, что пользователь не авторизован
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

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.UseStaticFiles();

app.Run();
