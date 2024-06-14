using DataAccess.Models.DTO;
using DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Models.DTO;

namespace BusinessLogic.Interfaces
{
    public interface IAuthRepo
    {
        public Task<User> Register(UserDTO user);

        public Task<UserRespDTO>? Login(string email, string password);
    }
}
