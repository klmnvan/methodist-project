using Methodist_API.Models.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Methodist_API.Configurations
{
    public class UserTokenConfiguration : IEntityTypeConfiguration<UserToken>
    {
        public void Configure(EntityTypeBuilder<UserToken> builder)
        {
            builder.ToTable("UserTokens");
            // Добавляем DeviceId как обычное поле
            builder.Property(e => e.DeviceId).IsRequired();
            builder.HasKey(e => new { e.UserId, e.LoginProvider, e.Name, e.DeviceId });
        }
    }
}
