using Methodist_API.Models.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Methodist_API.Configurations
{
    public class TypeOfEventConfiguration : IEntityTypeConfiguration<TypeOfEvent>
    {
        public void Configure(EntityTypeBuilder<TypeOfEvent> builder)
        {
            builder.Property(p => p.Id).HasColumnName("id");
            builder.Property(p => p.Name).HasColumnName("name");

            //связь один ко многим 
            builder.HasMany(p => p.Events).WithOne(p => p.TypeOfEvent).OnDelete(DeleteBehavior.Cascade).IsRequired();
        }
    }
}
