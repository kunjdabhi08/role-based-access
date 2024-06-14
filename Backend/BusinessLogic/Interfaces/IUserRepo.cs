using DataAccess.Models;
using DataAccess.Models.DTO;

namespace BusinessLogic.Interfaces
{
    public interface IUserRepo
    {

        public Task<User>? Delete(int userId);

        public Task<List<UserRespDTO>> Get();

        public Task Subscribe(int userId, int subscribe);
    }
}