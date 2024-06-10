using DataAccess.Models;
using DataAccess.Models.DTO;
using BusinessLogic.Interfaces;
using DataAccess.Data;
using BusinessLogic.Enums;

namespace BusinessLogic.Repositories
{
    public class AuthRepo : IAuthRepo
    {
        private readonly AppDBContext _dbContext;
        public AuthRepo(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }
        public User Register(UserDTO user)
        {
            var salt = BCrypt.Net.BCrypt.GenerateSalt();
            User? Exists = _dbContext.Users.FirstOrDefault(x => x.Email == user.Email && x.IsDeleted == false);
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


            _dbContext.Users.Add(u);
            _dbContext.SaveChanges();

            if (u.RoleId == (int)RoleTypeEnum.Reader)
            {

                Reader r = new Reader
                {
                    Name = user.Name,
                    Email = user.Email,
                    UserId = u.UserId
                };
                _dbContext.Readers.Add(r);
                _dbContext.SaveChanges();
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
                _dbContext.Authors.Add(author);
                _dbContext.SaveChanges();
            }

            return u;
        }

        public UserRespDTO? Login(string email, string password)
        {
            User? u = _dbContext.Users.FirstOrDefault(x => x.Email == email && x.IsDeleted == false);
            UserRespDTO user = new UserRespDTO();
            if (u != null)
            {
                bool loggedIn = BCrypt.Net.BCrypt.Verify(password, u.Password);
                if (loggedIn)
                {
                    user.Id = u.UserId;
                    user.Email = email;
                    user.Name = u.Name;
                    user.RoleId = u.RoleId;
                    user.RoleName = _dbContext.Roles.FirstOrDefault(x => x.RoleId == u.RoleId)?.RoleName;

                    if(u.RoleId == 3)
                    {
                        user.AuthorId = _dbContext.Authors.FirstOrDefault(x=> x.UserId == u.UserId)?.AuthorId;
                    }


                    return user;

                }
                throw new Exception("Credentials are not valid");
            }
            return null;
        }

    }
}
