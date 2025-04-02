using AutoMapper;
using Methodist_API.Data;
using Methodist_API.Dtos.CreateEntity;
using Methodist_API.Interfaces;
using Methodist_API.Models.DB;
using System.Threading.Tasks;

namespace Methodist_API.Repositories
{
    public class MKRepository : IMKRepository
    {
        private readonly MKDbContext _context;
        private readonly IMapper _mapper;

        public MKRepository(MKDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public List<MethodicalСommittee> Select() => _context.MethodicalСommittees.ToList();

        public bool UpdateHead(Guid MKId, Guid? profileId)
        {
            var updateEnt = _context.MethodicalСommittees.FirstOrDefault(it => it.Id == MKId);
            updateEnt.HeadId = profileId;
            _context.Update(updateEnt);
            return Save();
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false; //было ли изменено хотя бы одно значение в базе данных
        }

        public MethodicalСommittee Insert(MethodicalСommittee dto)
        {
            var result = _context.MethodicalСommittees.Add(dto);
            _context.SaveChanges();
            return result.Entity;
        }

        public bool Delete(Guid MKId)
        {
            MethodicalСommittee el = _context.MethodicalСommittees.FirstOrDefault(x => x.Id == MKId);
            if (el != null)
            {
                _context.Remove(el);
                return Save();
            }
            return false;
        }
    }
}
