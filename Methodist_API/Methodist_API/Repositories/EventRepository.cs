using AutoMapper;
using Methodist_API.Data;
using Methodist_API.Dtos.CreateEntity;
using Methodist_API.Dtos.DB;
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
            return _context.Events
                .Include(it => it.TypeOfEvent)
                .Include(it => it.Profile).ThenInclude(it => it.MethodicalСommittee)
                .Single(it => it.Id == item.Entity.Id);
        }

        public List<Event> SelectAll() => _context.Events
            .Include(it => it.TypeOfEvent)
            .Include(it => it.FileEvents)
            .Include(it => it.Profile).ThenInclude(it => it.MethodicalСommittee)
            .ToList();

        public List<Event> SelectByIdProfile(Guid profileId) => _context.Events
            .Where(it => it.ProfileId == profileId)
            .Include(it => it.TypeOfEvent)
            .Include(it => it.FileEvents)
            .Include(it => it.Profile).ThenInclude(it => it.MethodicalСommittee)
            .ToList();

        public List<Event> SelectByIdMC(Guid id)
        {
            var profile = _context.Profiles.Single(it => it.Id == id);
            return _context.Events
                .Where(it => it.Profile.MC_id == profile.MC_id)
                .Include(it => it.TypeOfEvent)
                .Include(it => it.FileEvents)
                .Include(it => it.Profile).ThenInclude(it => it.MethodicalСommittee)
                .ToList();
        }

        public bool TypeIsExists(Guid typeId)
        {
            return _context.TypeOfEvents.Any(it => it.Id == typeId);
        }

        public Event UpdatePart(Guid EventId, PatchEventDto dto)
        {
            var item = _context.Events.Single(x => x.Id == EventId);
            var dtoProperties = typeof(PatchEventDto).GetProperties();
            bool hasChanges = false;

            foreach (var property in dtoProperties)
            {
                var newValue = property.GetValue(dto);
                if (dto.IsFieldPresent(property.Name))
                {
                    var itemProperty = typeof(Event).GetProperty(property.Name);
                    if (itemProperty != null && itemProperty.CanWrite)
                    {
                        var currentValue = itemProperty.GetValue(item);
                        if (!Equals(currentValue, newValue)) hasChanges = true;
                        itemProperty.SetValue(item, newValue);
                    }
                }
            }
            if (!hasChanges) return item;
            item.UpdatedAt = DateTime.UtcNow;
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

        public List<TypeOfEvent> SelectAllTypes()
        {
            return _context.TypeOfEvents.ToList();
        }

        public List<ResultOwnerType> SelectOwnerTypeByResults()
        {
            return _context.ResultOwnerTypes.ToList();
        }
    }
}
