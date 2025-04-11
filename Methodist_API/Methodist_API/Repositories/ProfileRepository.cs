using AutoMapper;
using Methodist_API.Data;
using Methodist_API.Dtos.Patch;
using Methodist_API.Interfaces;
using Methodist_API.Models.DB;
using Microsoft.EntityFrameworkCore;

namespace Methodist_API.Repositories
{
    public class ProfileRepository: IProfileRepository
    {
        private readonly MKDbContext _context;
        private readonly IMapper _mapper;

        public ProfileRepository(MKDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public Models.DB.Profile SelectByIdProfile(Guid profileId) => _context.Profiles
            .Include(it => it.MethodicalСommittees)
            .Include(it => it.MethodicalСommittee)
            .Single(it => it.Id == profileId);

        public bool UpdateImage(Guid profileId, string url)
        {
            var updateEnt = _context.Profiles.FirstOrDefault(it => it.Id == profileId);
            updateEnt.ImageUrl = url;
            _context.Update(updateEnt);
            return Save();
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false; //было ли изменено хотя бы одно значение в базе данных
        }

        public Models.DB.Profile UpdatePart(Guid ProfileId, PatchProfileDto dto)
        {
            var item = _context.Profiles.Single(x => x.Id == ProfileId);
            var dtoProperties = typeof(PatchProfileDto).GetProperties();
            bool hasChanges = false;

            foreach (var property in dtoProperties)
            {
                var newValue = property.GetValue(dto);
                if (dto.IsFieldPresent(property.Name))
                {
                    var itemProperty = typeof(Models.DB.Profile).GetProperty(property.Name);
                    if (itemProperty != null && itemProperty.CanWrite)
                    {
                        var currentValue = itemProperty.GetValue(item); // Получаем текущее значение
                        if (!Equals(currentValue, newValue)) hasChanges = true; // Изменения есть только если значения разные
                        itemProperty.SetValue(item, newValue);
                    }
                }
            }
            if(!hasChanges) return item;
            if (Save()) return item;
            else throw new Exception("Ошибка изменения профиля");
        }
    }
}
