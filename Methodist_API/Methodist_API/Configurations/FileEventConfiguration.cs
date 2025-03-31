using Methodist_API.Models.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Methodist_API.Configurations
{
    public class FileEventConfiguration : IEntityTypeConfiguration<FileEvent>
    {
        public void Configure(EntityTypeBuilder<FileEvent> builder)
        {
            builder.Property(p => p.Id).HasColumnName("id");
            builder.Property(p => p.EventId).HasColumnName("event_id");
            builder.Property(p => p.FileName).HasColumnName("file_name");

            builder.HasOne(fe => fe.Event).WithMany(fe => fe.FileEvents).OnDelete(DeleteBehavior.Cascade).HasForeignKey(t => t.EventId);
        }
    }
}
