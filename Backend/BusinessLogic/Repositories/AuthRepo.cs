using DataAccess.Models;
using DataAccess.Models.DTO;
using BusinessLogic.Interfaces;
using DataAccess.Data;
using BusinessLogic.Enums;
using Microsoft.EntityFrameworkCore;

namespace BusinessLogic.Repositories
{
    public class AuthRepo : IAuthRepo
    {
        private readonly AppDBContext _dbContext;
        public AuthRepo(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<User> Register(UserDTO user)
        {
            var salt = BCrypt.Net.BCrypt.GenerateSalt();
            User? Exists = await _dbContext.Users.FirstOrDefaultAsync(userFromDb => userFromDb.Email == user.Email && userFromDb.IsDeleted == false);
            if (Exists != null) {
                throw new Exception("User Already Exists with this email");
            }
            User u = new User
            {
                Name = user.Name,
                Email = user.Email,
                RoleId = user.roleId == (int)RoleTypeEnum.Author ? 3 : 5,
                Password = BCrypt.Net.BCrypt.HashPassword(user.Password, salt),
                CreatedAt = DateTime.UtcNow,

            };


            await _dbContext.Users.AddAsync(u);
            await _dbContext.SaveChangesAsync();

            if (u.RoleId == (int)RoleTypeEnum.Reader)
            {

                Reader r = new Reader
                {
                    Name = user.Name,
                    Email = user.Email,
                    UserId = u.UserId
                };
                await _dbContext.Readers.AddAsync(r);
                await _dbContext.SaveChangesAsync();
            }

            if(u.RoleId == (int)RoleTypeEnum.Author)
            {
                Author author = new Author
                {
                    Name = user.Name,
                    Email = user.Email,
                    UserId = u.UserId,
                    TotalBlogs = 0,
                };
                await _dbContext.Authors.AddAsync(author);
                await _dbContext.SaveChangesAsync();
            }

            return u;
        }

        public async Task<UserRespDTO>? Login(string email, string password)
        {
            User? loginUser = await _dbContext.Users.FirstOrDefaultAsync(x => x.Email == email && x.IsDeleted == false);
            UserRespDTO user = new UserRespDTO();
            if (loginUser != null)
            {
                bool loggedIn = BCrypt.Net.BCrypt.Verify(password, loginUser.Password);
                if (loggedIn)
                {
                    user.Id = loginUser.UserId;
                    user.Email = email;
                    user.Name = loginUser.Name;
                    user.RoleId = loginUser.RoleId;
                    user.RoleName =  _dbContext.Roles.FirstOrDefault(role => role.RoleId == loginUser.RoleId)?.RoleName;

                    if(loginUser.RoleId == 3)
                    {
                        user.AuthorId =  _dbContext.Authors.FirstOrDefault(author=> author.UserId == loginUser.UserId)?.AuthorId;
                    }


                    return user;

                }
                throw new Exception("Credentials are not valid");
            }
            return null;
        }

    }
}
