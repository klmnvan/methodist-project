using Methodist_API.Models.DB;
using Methodist_API.Models.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Methodist_API.Configurations
{
    public class AppUserConfiguration : IEntityTypeConfiguration<AppUser>
    {
        public void Configure(EntityTypeBuilder<AppUser> builder)
        {
            builder.HasOne(au => au.ProfileNavigation).WithOne(u => u.AppUser).HasForeignKey<Profile>(u => u.Id).OnDelete(DeleteBehavior.Cascade).IsRequired();
        }
    }
}
