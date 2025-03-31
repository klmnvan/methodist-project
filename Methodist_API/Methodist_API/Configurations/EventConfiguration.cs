using Methodist_API.Models.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Methodist_API.Configurations
{
    public class EventConfiguration : IEntityTypeConfiguration<Event>
    {
        public void Configure(EntityTypeBuilder<Event> builder)
        {
            builder.Property(p => p.Id).HasColumnName("id");
            builder.Property(p => p.DateOfEvent).HasColumnName("date_of_event");
            builder.Property(p => p.EndDateOfEvent).HasColumnName("end_date_of_event");
            builder.Property(p => p.TypeId).HasColumnName("type_id");
            builder.Property(p => p.IsChecked).HasColumnName("is_checked");
            builder.Property(p => p.IsApproved).HasColumnName("is_approoved");
            builder.Property(p => p.Type).HasColumnName("type");
            builder.Property(p => p.Name).HasColumnName("name");
            builder.Property(p => p.FormOfParticipation).HasColumnName("form_of_participation");
            builder.Property(p => p.FormOfEvent).HasColumnName("form_of_event");
            builder.Property(p => p.Status).HasColumnName("status");
            builder.Property(p => p.Location).HasColumnName("location");
            builder.Property(p => p.QuantityOfHours).HasColumnName("quantity_of_hours");
            builder.Property(p => p.Result).HasColumnName("result");
            builder.Property(p => p.ProfileId).HasColumnName("profile_id");

            //связь один ко многим 
            builder.HasOne(p => p.Profile).WithMany(p => p.Events).OnDelete(DeleteBehavior.Cascade).IsRequired();
            builder.HasOne(p => p.TypeOfEvent).WithMany(p => p.Events).OnDelete(DeleteBehavior.Cascade).IsRequired();
            builder.HasMany(p => p.FileEvents).WithOne(p => p.Event).OnDelete(DeleteBehavior.Cascade).IsRequired();
        }
    }
}
