using Methodist_API.Models.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Methodist_API.Configurations
{
    public class MethodicalСommitteeConfiguration : IEntityTypeConfiguration<MethodicalСommittee>
    {
        public void Configure(EntityTypeBuilder<MethodicalСommittee> builder)
        {
            builder.ToTable("methodical_committees");

            builder.Property(p => p.Id).HasColumnName("id").HasDefaultValueSql("gen_random_uuid()").ValueGeneratedOnAdd();
            builder.Property(p => p.Name).HasColumnName("name");
            builder.Property(p => p.HeadId).HasColumnName("head_id");

            //связь один ко многим 
            builder
                .HasMany(it => it.Profiles)
                .WithOne(it => it.MethodicalСommittee)
                .HasForeignKey(it => it.MC_id)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired(false);

            builder
                .HasOne(it => it.Profile)
                .WithMany(it => it.MethodicalСommittees)
                .HasForeignKey(it => it.HeadId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired(false);
        }
    }
}
