using Methodist_API.Dtos.Patch;
using Methodist_API.Models.DB;

namespace Methodist_API.Interfaces
{
    public interface IProfileRepository
    {
        public Profile SelectByIdProfile(Guid profileId);
        public bool UpdateImage(Guid profileId, string url);
        public Profile UpdatePart(Guid ProfileId, PatchProfileDto dto);

    }
}
