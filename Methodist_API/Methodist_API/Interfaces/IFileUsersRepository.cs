using Methodist_API.Models.DB;

namespace Methodist_API.Interfaces
{
    public interface IFileUsersRepository
    {
        public EventResult Insert(Guid idEvent, string fileName);
    }
}
