using Methodist_API.Dtos.CreateEntity;
using Methodist_API.Models.DB;

namespace Methodist_API.Interfaces
{
    public interface IMKRepository
    {
        public List<MethodicalСommittee> Select();
        public bool UpdateHead(Guid MKId, Guid? profileId);
        public MethodicalСommittee Insert(MethodicalСommittee dto);
        public bool Delete(Guid MKId);
    }
}
