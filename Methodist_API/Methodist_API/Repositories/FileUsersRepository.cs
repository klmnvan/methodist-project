using AutoMapper;
using Methodist_API.Data;
using Methodist_API.Interfaces;
using Methodist_API.Models.DB;

namespace Methodist_API.Repositories
{
    public class FileUsersRepository: IFileUsersRepository
    {
        private readonly MKDbContext _context;
        private readonly IMapper _mapper;

        public FileUsersRepository(MKDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public EventResult Insert(Guid idEvent, string fileName)
        {
            var item = _context.FileEvents.Add(new EventResult { FileName = fileName, EventId = idEvent });
            _context.SaveChanges();
            return item.Entity;
        }
    }
}
