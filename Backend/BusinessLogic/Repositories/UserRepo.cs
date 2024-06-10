using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Models;
using DataAccess.Models.DTO;
using BusinessLogic.Interfaces;
using DataAccess.Data;
using DataAccess.Models.DTO;

namespace BusinessLogic.Repositories
{
    public class UserRepo : IUserRepo
    {
        private readonly AppDBContext _dbContext;
        public UserRepo(AppDBContext dBContext)
        {
            _dbContext = dBContext;
        }


        public User? Delete(int userId)
        {
            User user = _dbContext.Users.FirstOrDefault(x => x.UserId == userId && x.IsDeleted == false);

            if (user != null)
            {
                user.IsDeleted = true;
                _dbContext.Users.Update(user);
                _dbContext.SaveChanges();
            }
                    

            return user;
        }

        public List<UserRespDTO> Get()
        {
            List<UserRespDTO> users = _dbContext.Users.Where(x=>x.IsDeleted == false).Select(x => new UserRespDTO
            {
                Id = x.UserId,
                Name = x.Name,
                Email = x.Email,
                RoleId = x.RoleId,
                RoleName = x.Role.RoleName,
                IsSubscribed = _dbContext.Readers.FirstOrDefault(y => y.UserId == x.UserId).IsSubscribed
            }).ToList();

            return users;
        }


        public void Subscribe(int userId, int subscribe)
        {
            User user = _dbContext.Users.FirstOrDefault(x => x.UserId == userId && x.IsDeleted == false);
            if (user != null)
            {
                user.RoleId = subscribe == 1 ?  4 : 5;
                _dbContext.Users.Update(user);
                _dbContext.SaveChanges();
            }
            Reader r = _dbContext.Readers.FirstOrDefault(x => x.UserId == userId);
            if(r != null)
            {
                r.IsSubscribed = subscribe == 1 ? true : false;
                _dbContext.Readers.Update(r);
                _dbContext.SaveChanges();
            }
        }
    }
}
