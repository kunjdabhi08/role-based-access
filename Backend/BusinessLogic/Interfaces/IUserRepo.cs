using DataAccess.Models;
using DataAccess.Models.DTO;

namespace BusinessLogic.Interfaces
{
    public interface IUserRepo
    {

        public User? Delete(int userId);

        public List<UserRespDTO> Get();

        public void Subscribe(int userId, int subscribe);
    }
}