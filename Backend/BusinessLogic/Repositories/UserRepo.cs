using DataAccess.Models;
using DataAccess.Models.DTO;
using BusinessLogic.Interfaces;
using DataAccess.Data;
using Microsoft.EntityFrameworkCore;

namespace BusinessLogic.Repositories
{
    public class UserRepo : IUserRepo
    {
        private readonly AppDBContext _dbContext;
        public UserRepo(AppDBContext dBContext)
        {
            _dbContext = dBContext;
        }


        public async Task<User?> Delete(int userId)
        {
            User? user = await _dbContext.Users.FirstOrDefaultAsync(user => user.UserId == userId && !user.IsDeleted);

            if (user != null)
            {
                user.IsDeleted = true;
                _dbContext.Users.Update(user);
                await _dbContext.SaveChangesAsync();
            }

            return user;
        }


        public async Task<List<UserRespDTO>> Get()
        {
            List<UserRespDTO> users = await _dbContext.Users
                .Where(x => !x.IsDeleted)
                .Select(x => new UserRespDTO
                {
                    Id = x.UserId,
                    Name = x.Name,
                    Email = x.Email,
                    RoleId = x.RoleId,
                    RoleName = x.Role.RoleName,
                    IsSubscribed = _dbContext.Readers.FirstOrDefault(reader => reader.UserId == reader.UserId).IsSubscribed
                })
                .ToListAsync();

            return users;
        }



        public async Task Subscribe(int userId, int subscribe)
        {
            User? user = await _dbContext.Users.FirstOrDefaultAsync(user => user.UserId == userId && !user.IsDeleted);
            if (user != null)
            {
                user.RoleId = subscribe == 1 ? 4 : 5;
                _dbContext.Users.Update(user);
                await _dbContext.SaveChangesAsync();
            }

            Reader? reader = await _dbContext.Readers.FirstOrDefaultAsync(reader => reader.UserId == userId);
            if (reader != null)
            {
                reader.IsSubscribed = subscribe == 1;
                _dbContext.Readers.Update(reader);
                await _dbContext.SaveChangesAsync();
            }
        }
    }
}
