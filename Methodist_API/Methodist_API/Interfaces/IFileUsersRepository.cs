using Methodist_API.Models.DB;

namespace Methodist_API.Interfaces
{
    public interface IFileUsersRepository
    {
        public FileEvent Insert(Guid idEvent, string fileName);
    }
}
