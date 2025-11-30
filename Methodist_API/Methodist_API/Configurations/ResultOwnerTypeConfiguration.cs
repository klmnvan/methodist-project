using Methodist_API.Models.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Methodist_API.Configurations
{
    public class ResultOwnerTypeConfiguration : IEntityTypeConfiguration<ResultOwnerType>
    {
        public void Configure(EntityTypeBuilder<ResultOwnerType> builder)
        {
            builder.ToTable("result_owner_types");

            builder.Property(p => p.Id).HasColumnName("id").HasDefaultValueSql("gen_random_uuid()").ValueGeneratedOnAdd();
            builder.Property(p => p.Name).HasColumnName("name");

            //связь один ко многим 
            builder.HasMany(p => p.Results).WithOne(p => p.ResultOwnerType).OnDelete(DeleteBehavior.Cascade).IsRequired();
        }
    }
}
