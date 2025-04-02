using Methodist_API.Configurations;
using Methodist_API.Models.DB;
using Methodist_API.Models.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Methodist_API.Data
{
    public class MKDbContext(DbContextOptions<MKDbContext> options) : IdentityDbContext<AppUser, Role, Guid>(options)
    {
        //добавление сущностей в контекст БД
        public DbSet<Profile> Profiles { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<FileEvent> FileEvents { get; set; }
        public DbSet<MethodicalСommittee> MethodicalСommittees { get; set; }
        public DbSet<TypeOfEvent> TypeOfEvents { get; set; }
        public DbSet<UserToken> TypeOUserTokens { get; set; }

        //при запуске миграции, EF итак создаст таблицы (без конфигурации), но, чтобы быть уверенным в том, чтобы все связи и вся БД создалась правильно, делают конфигурацию
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<IdentityUserClaim<Guid>>().ToTable("AspNetUserClaims", t => t.ExcludeFromMigrations());
            modelBuilder.Entity<IdentityRoleClaim<Guid>>().ToTable("AspNetRoleClaims", t => t.ExcludeFromMigrations());
            modelBuilder.Entity<IdentityUserLogin<Guid>>().ToTable("AspNetUserLogins", t => t.ExcludeFromMigrations());
            modelBuilder.Entity<IdentityUserToken<Guid>>().ToTable("AspNetUserTokens", t => t.ExcludeFromMigrations());

            modelBuilder.ApplyConfiguration(new AppUserConfiguration());
            modelBuilder.ApplyConfiguration(new UserTokenConfiguration());
            modelBuilder.ApplyConfiguration(new EventConfiguration());
            modelBuilder.ApplyConfiguration(new FileEventConfiguration());
            modelBuilder.ApplyConfiguration(new MethodicalСommitteeConfiguration());
            modelBuilder.ApplyConfiguration(new ProfileConfiguration());
            modelBuilder.ApplyConfiguration(new TypeOfEventConfiguration());

            //Заполняем роли
            modelBuilder.Entity<Role>().HasData(new List<Role>
            {
                new Role
                {
                    Id = new Guid("f47ac10b-58cc-4372-a567-0e02b2c3d479"),
                    Name = "Admin",
                    NormalizedName = "ADMIN",
                    ConcurrencyStamp = "f47ac10b-58cc-4372-a567-0e02b2c3d479"
                },
                new Role
                {
                    Id = new Guid("c9eb182b-1c3e-4c3b-8c3e-1c3e4c3b8c3e"),
                    Name = "Teacher",
                    NormalizedName = "TEACHER",
                    ConcurrencyStamp = "c9eb182b-1c3e-4c3b-8c3e-1c3e4c3b8c3e"
                },
            });

            // Типы мероприятий
            modelBuilder.Entity<TypeOfEvent>().HasData(
                new TypeOfEvent { Id = new Guid("ec2d1d7b-4cb7-41e1-aa80-74f695fea627"), Name = "Проведение" },
                new TypeOfEvent { Id = new Guid("638ea3fe-b998-4a6e-a06e-3331597e34b8"), Name = "Участие" },
                new TypeOfEvent { Id = new Guid("5ce9f584-6fea-41e9-9a64-4ab4d9d09e84"), Name = "Публикация" },
                new TypeOfEvent { Id = new Guid("01f2e985-5066-4a1c-bc51-5c46b6b20362"), Name = "Стажировка" }
            );

            // Методические комиссии
            modelBuilder.Entity<MethodicalСommittee>().HasData(
                new MethodicalСommittee { Id = new Guid("52c00ef1-4a3d-4995-a842-eb525fe82aef"), Name = "Математических и естественно - научных дисциплин" },
                new MethodicalСommittee { Id = new Guid("12b926c0-2e39-4d06-a588-1f8f018622a9"), Name = "Гуманитарных дисциплин" },
                new MethodicalСommittee { Id = new Guid("49dcb840-1885-4a19-87d6-8c0fa80fede7"), Name = "Иностранного языка" },
                new MethodicalСommittee { Id = new Guid("cc476f29-7419-4254-aa5c-7d869a21bbe9"), Name = "Дисциплин физической культуры и БЖД" },
                new MethodicalСommittee { Id = new Guid("f778fac4-7fff-4f7b-a8a1-49a07640acab"), Name = "Общественных и правовых дисциплин" },
                new MethodicalСommittee { Id = new Guid("d793c1bb-9082-4367-8789-53ff550057cc"), Name = "Информатика и вычислительная техника" },
                new MethodicalСommittee { Id = new Guid("97c70cce-7639-4154-b84d-8cc94593820b"), Name = "Экономика и управление, логистика" },
                new MethodicalСommittee { Id = new Guid("5d22e938-b4fc-4044-be1b-00bc654becdb"), Name = "Специальностей Товароведение, Коммерция" },
                new MethodicalСommittee { Id = new Guid("707b476f-0905-41ba-8dea-f32fea287448"), Name = "Специальностей Банковское дело, ДОУ" },
                new MethodicalСommittee { Id = new Guid("c2d0d4dc-35ce-4d37-b0ec-462eae895980"), Name = "Инструментальных дисциплин" },
                new MethodicalСommittee { Id = new Guid("4e3f28ce-029a-40d5-a02a-765d72f35bfe"), Name = "Музыкальных дисциплин" },
                new MethodicalСommittee { Id = new Guid("574378fc-b335-4466-84ab-b15441e3b3bb"), Name = "Специальности Дошкольное образование" },
                new MethodicalСommittee { Id = new Guid("67f33b56-53ba-4609-9423-ca5565996262"), Name = "Специальности Преподавание в начальных классах" }
            );
        }

    }
}
