using AutoMapper;
using Methodist_API.Data;
using Methodist_API.Dtos.CreateEntity;
using Methodist_API.Dtos.Patch;
using Methodist_API.Interfaces;
using Methodist_API.Models.DB;
using Microsoft.EntityFrameworkCore;

namespace Methodist_API.Repositories
{
    public class EventRepository : IEventRepository
    {
        private readonly MKDbContext _context;
        private readonly IMapper _mapper;

        public EventRepository(MKDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public Event Insert(CreateEventDto newEvent, Guid profileId)
        {
            var _event = _mapper.Map<Event>(newEvent);
            _event.ProfileId = profileId;
            _event.Id = Guid.NewGuid();
            var item = _context.Events.Add(_event);
            _context.SaveChanges();
            return _context.Events.Include(it => it.TypeOfEvent).Single(it => it.Id == item.Entity.Id);
        }

        public List<Event> SelectByIdProfile(Guid profileId) => _context.Events.Where(it => it.ProfileId == profileId).Include(it => it.TypeOfEvent).ToList();

        public bool TypeIsExists(Guid typeId)
        {
            return _context.TypeOfEvents.Any(it => it.Id == typeId);
        }

        public Event UpdatePart(Guid EventId, PatchEventDto dto)
        {
            var item = _context.Events.Single(x => x.Id == EventId);
            var dtoProperties = typeof(PatchEventDto).GetProperties();

            foreach (var property in dtoProperties)
            {
                var newValue = property.GetValue(dto);
                if (dto.IsFieldPresent(property.Name))
                {
                    var itemProperty = typeof(Event).GetProperty(property.Name);
                    if (itemProperty != null && itemProperty.CanWrite)
                    {
                        itemProperty.SetValue(item, newValue);
                    }
                }
            }
            if (Save()) return item;
            else throw new Exception("Ошибка изменения мероприятия");
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false; //было ли изменено хотя бы одно значение в базе данных
        }

        public bool Delete(Guid eventId)
        {
            Event el = _context.Events.FirstOrDefault(x => x.Id == eventId);
            if (el != null)
            {
                _context.Remove(el);
                return Save();
            }
            return false;
        }
    }
}
