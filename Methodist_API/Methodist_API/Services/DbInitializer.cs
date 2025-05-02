using AutoMapper;
using Methodist_API.Data;
using Methodist_API.Dtos.Account;
using Methodist_API.Models.DB;
using Methodist_API.Models.Identity;
using Microsoft.AspNetCore.Identity;

public static class DbInitializer
{
    public static async Task InitializeAsync(MKDbContext context, UserManager<AppUser> userManager, RoleManager<Role> roleManager, IMapper mapper)
    {
        // Проверяем, есть ли уже администратор в базе
        var adminEmail = "admin@example.com";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);

        if (adminUser == null)
        {
            // Создаем пользователя администратора
            var admin = new AppUser
            {
                Id = Guid.NewGuid(),
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            // Устанавливаем пароль
            var result = await userManager.CreateAsync(admin, "Adm1n@!7");

            if (result.Succeeded)
            {
                // Находим роль администратора
                var adminRole = await roleManager.FindByNameAsync("ADMIN");

                // Если роль существует, добавляем пользователя в роль
                if (adminRole != null)
                {
                    var roleResult = await userManager.AddToRoleAsync(admin, adminRole.NormalizedName);
                    if (roleResult.Succeeded)
                    {
                        var user = await userManager.FindByEmailAsync(adminEmail);
                        if (user != null)
                        {
                            Methodist_API.Models.DB.Profile newProfile = mapper.Map<Methodist_API.Models.DB.Profile>(
                                new Methodist_API.Models.DB.Profile
                                {
                                    Id = user.Id,
                                    FirstName = "Администратор",
                                });
                            newProfile.AppUser = admin;
                            newProfile.Id = user.Id;
                            context.Profiles.Add(newProfile);
                            context.SaveChanges();
                        }
                    }
                }
            }
        }
    }
}
