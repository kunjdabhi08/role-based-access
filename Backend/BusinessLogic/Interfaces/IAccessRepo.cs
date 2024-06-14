using DataAccess.Models;
using DataAccess.Models.DTO;

namespace BusinessLogic.Interfaces
{
    public interface IAccessRepo
    {
        public Access? Get(int roleid, int screenid);

        public Task<List<AccessDTO>>? Edit(List<AccessDTO> accesses);

        public Task<List<AccessDTO>> Get(int roleId);
    }
}