using Methodist_API.Models.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Methodist_API.Configurations
{
    public class FileEventConfiguration : IEntityTypeConfiguration<FileEvent>
    {
        public void Configure(EntityTypeBuilder<FileEvent> builder)
        {
            builder.ToTable("result_events");

            builder.Property(p => p.Id).HasColumnName("id").HasDefaultValueSql("gen_random_uuid()").ValueGeneratedOnAdd();
            builder.Property(p => p.EventId).HasColumnName("event_id").IsRequired();
            builder.Property(p => p.FileName).HasColumnName("file_name").IsRequired(false);
            builder.Property(p => p.OwnerTypeId).HasColumnName("owner_type_id").IsRequired();
            builder.Property(p => p.Result).HasColumnName("result").IsRequired();

            builder.HasOne(fe => fe.Event).WithMany(fe => fe.FileEvents).OnDelete(DeleteBehavior.Cascade).HasForeignKey(t => t.EventId);
            builder.HasOne(rt => rt.ResultOwnerType).WithMany(rt => rt.Results).OnDelete(DeleteBehavior.Cascade).HasForeignKey(t => t.OwnerTypeId);
        }
    }

}
