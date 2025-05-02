using Methodist_API.Models.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Methodist_API.Configurations
{
    public class ProfileConfiguration : IEntityTypeConfiguration<Profile>
    {
        public void Configure(EntityTypeBuilder<Profile> builder)
        {
            builder.ToTable("profiles");

            builder.Property(p => p.Id).HasColumnName("id").HasDefaultValueSql("gen_random_uuid()").ValueGeneratedOnAdd();
            builder.Property(p => p.FirstName).HasColumnName("first_name");
            builder.Property(p => p.LastName).HasColumnName("last_name");
            builder.Property(p => p.Patronymic).HasColumnName("patronymic");
            builder.Property(p => p.MC_id).HasColumnName("MC_id").IsRequired(false);
            builder.Property(p => p.ImageUrl).HasColumnName("image_url");
            builder.Property(p => p.СreatedAt).HasColumnName("created_at").HasDefaultValueSql("now()").IsRequired();
            builder.Property(p => p.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("now()").IsRequired();

            builder.HasMany(p => p.Events).WithOne(p => p.Profile).OnDelete(DeleteBehavior.Cascade).HasForeignKey(r => r.ProfileId);

            builder
                .HasOne(it => it.MethodicalСommittee)
                .WithMany(it => it.Profiles)
                .HasForeignKey(it => it.MC_id)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired(false);

            builder
                .HasMany(it => it.MethodicalСommittees)
                .WithOne(it => it.Profile)
                .HasForeignKey(it => it.HeadId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired(false);
        }
    }
}
