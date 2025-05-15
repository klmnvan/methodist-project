using Methodist_API.Dtos.CreateEntity;
using Methodist_API.Dtos.Patch;
using Methodist_API.Models.DB;

namespace Methodist_API.Interfaces
{
    public interface IEventRepository
    {
        public List<Event> SelectAll();
        public List<Event> SelectByIdProfile(Guid profileId);
        public List<Event> SelectByIdMC(Guid id);

        public Event Insert(CreateEventDto newEvent, Guid profileId);

        public bool TypeIsExists(Guid typeId);

        public Event UpdatePart(Guid eventId, PatchEventDto dto);
        public bool Delete(Guid eventId);

    }
}
