using DataAccess.Models;

namespace BusinessLogic.Interfaces
{
    public interface IRoleRepo
    {
        public List<Role> Get();
    }
}