using Methodist_API.Models.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Methodist_API.Configurations
{
    public class ProfileConfiguration : IEntityTypeConfiguration<Profile>
    {
        public void Configure(EntityTypeBuilder<Profile> builder)
        {
            builder.Property(p => p.Id).HasColumnName("id");
            builder.Property(p => p.FirstName).HasColumnName("first_name");
            builder.Property(p => p.LastName).HasColumnName("last_name");
            builder.Property(p => p.Patronymic).HasColumnName("patronymic");
            builder.Property(p => p.MC_id).HasColumnName("MC_id");

            builder.HasMany(p => p.MethodicalСommittees).WithOne(p => p.Profile).OnDelete(DeleteBehavior.Cascade).IsRequired();           
            builder.HasMany(p => p.Events).WithOne(p => p.Profile).OnDelete(DeleteBehavior.Cascade).IsRequired();           
            builder.HasOne(p => p.MethodicalСommittee).WithMany(p => p.Profiles).OnDelete(DeleteBehavior.Cascade).IsRequired();           
        }
    }
}
