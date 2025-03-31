using Methodist_API.Models.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Methodist_API.Configurations
{
    public class MethodicalСommitteeConfiguration : IEntityTypeConfiguration<MethodicalСommittee>
    {
        public void Configure(EntityTypeBuilder<MethodicalСommittee> builder)
        {
            builder.Property(p => p.Id).HasColumnName("id");
            builder.Property(p => p.Name).HasColumnName("name");
            builder.Property(p => p.HeadId).HasColumnName("head_id");

            //связь один ко многим 
            builder.HasOne(it => it.Profile).WithMany(it => it.MethodicalСommittees).OnDelete(DeleteBehavior.Cascade).HasForeignKey(t => t.HeadId);
            builder.HasMany(it => it.Profiles).WithOne(it => it.MethodicalСommittee).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
