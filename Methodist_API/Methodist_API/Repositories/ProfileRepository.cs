using AutoMapper;
using Methodist_API.Data;
using Methodist_API.Interfaces;

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

        public Models.DB.Profile SelectByIdProfile(Guid profileId) => _context.Profiles.Single(it => it.Id == profileId);

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
    }
}
