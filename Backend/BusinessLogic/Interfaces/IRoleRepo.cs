using DataAccess.Models;

namespace BusinessLogic.Interfaces
{
    public interface IRoleRepo
    {
        public Task<List<Role>> Get();
    }
}