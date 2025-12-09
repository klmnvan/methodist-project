using Methodist_API.Models.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Methodist_API.Configurations
{
    public class EventConfiguration : IEntityTypeConfiguration<Event>
    {
        public void Configure(EntityTypeBuilder<Event> builder)
        {
            builder.ToTable("events");

            builder.Property(p => p.Id).HasColumnName("id").HasDefaultValueSql("gen_random_uuid()").ValueGeneratedOnAdd();
            builder.Property(p => p.DateOfEvent).HasColumnName("date_of_event").IsRequired();
            builder.Property(p => p.EndDateOfEvent).HasColumnName("end_date_of_event").IsRequired();
            builder.Property(p => p.TypeId).HasColumnName("type_id").IsRequired();
            builder.Property(p => p.IsChecked).HasColumnName("is_checked").IsRequired();
            builder.Property(p => p.IsApproved).HasColumnName("is_approoved").IsRequired();
            builder.Property(p => p.Type).HasColumnName("type").IsRequired(false);
            builder.Property(p => p.Name).HasColumnName("name").IsRequired(false);
            builder.Property(p => p.FormOfParticipation).HasColumnName("form_of_participation").IsRequired(false);
            builder.Property(p => p.FormOfEvent).HasColumnName("form_of_event").IsRequired(false);
            builder.Property(p => p.Status).HasColumnName("status").IsRequired(false);
            builder.Property(p => p.Location).HasColumnName("location").IsRequired(false);
            builder.Property(p => p.QuantityOfHours).HasColumnName("quantity_of_hours").IsRequired(false);
            builder.Property(p => p.ParticipantsCount).HasColumnName("participants_count").IsRequired(false);
            builder.Property(p => p.ProfileId).HasColumnName("profile_id").IsRequired();
            builder.Property(p => p.CreatedAt).HasColumnName("created_at").IsRequired().HasDefaultValueSql("now()");
            builder.Property(p => p.UpdatedAt).HasColumnName("updated_at").IsRequired().HasDefaultValueSql("now()");

            //связь один ко многим 
            builder.HasOne(p => p.Profile).WithMany(p => p.Events).OnDelete(DeleteBehavior.Cascade).HasForeignKey(r => r.ProfileId);
            builder.HasOne(p => p.TypeOfEvent).WithMany(p => p.Events).OnDelete(DeleteBehavior.Cascade).HasForeignKey(r => r.TypeId);
            builder.HasMany(p => p.Results).WithOne(p => p.Event).OnDelete(DeleteBehavior.Cascade).HasForeignKey(r => r.EventId);
        }
    }
}
