using DataAccess.Models;
using DataAccess.Models.DTO;

namespace BusinessLogic.Interfaces
{
    public interface IAccessRepo
    {
        public Access? Get(int roleid, int screenid);

        public Access? Edit(int roleid, int screenid, bool[] editedAccess);

        public List<AccessDTO> Get();

        public List<AccessDTO> Get(int roleId);

    }
}