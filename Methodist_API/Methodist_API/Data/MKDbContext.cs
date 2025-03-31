using Methodist_API.Configurations;
using Methodist_API.Models.DB;
using Methodist_API.Models.Identity;
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

        //при запуске миграции, EF итак создаст таблицы (без конфигурации), но, чтобы быть уверенным в том, чтобы все связи и вся БД создалась правильно, делают конфигурацию
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new AppUserConfiguration());
            modelBuilder.ApplyConfiguration(new EventConfiguration());
            modelBuilder.ApplyConfiguration(new FileEventConfiguration());
            modelBuilder.ApplyConfiguration(new MethodicalСommitteeConfiguration());
            modelBuilder.ApplyConfiguration(new ProfileConfiguration());
            modelBuilder.ApplyConfiguration(new TypeOfEventConfiguration());
        }

    }
}
