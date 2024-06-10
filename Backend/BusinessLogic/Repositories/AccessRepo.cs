
using DataAccess.Models;
using BusinessLogic.Interfaces;
using DataAccess.Data;
using DataAccess.Models.DTO;

namespace BusinessLogic.Repositories
{
    public class AccessRepo : IAccessRepo
    {
        private readonly AppDBContext _dbContext;
        public AccessRepo(AppDBContext context)
        {
            _dbContext = context;
        }

        public Access? Get(int roleid, int screenid)
        {
            Access? access = _dbContext.Accesses.FirstOrDefault(x=> x.RoleId == roleid && x.ScreenId == screenid);
            return access;
        }


        public Access? Edit(int screenid, int roleid, bool[] editedAccess)
        {
            Access? access = _dbContext.Accesses.FirstOrDefault(x=> x.RoleId == roleid && x.ScreenId == screenid);
            if(access != null)
            {
                access.Create = editedAccess[0];
                access.Edit = editedAccess[1];
                access.Delete = editedAccess[2];
                access.View = editedAccess[3];

                _dbContext.Accesses.Update(access);
                _dbContext.SaveChanges();
            }

            return access;
        }

        public List<AccessDTO> Get()
        {
            List<AccessDTO> access = _dbContext.Accesses.Select(x=> new AccessDTO {
                RoleId = x.RoleId,
                ScreenId = x.ScreenId,
                AccessId = x.AccessId,
                Accesses = new bool[] {x.Create, x.Edit, x.Delete, x.View },
                RoleName = x.Role.RoleName,
                ScreenName = x.Screen.ScreenName
            }).ToList();
            return access;
        }
        
        public List<AccessDTO> Get(int roleId)
        {
            List<AccessDTO> access = _dbContext.Accesses.Where(x=>x.RoleId == roleId).Select(x=> new AccessDTO {
                AccessId = x.AccessId,
                RoleId = x.RoleId,
                ScreenId = x.ScreenId,
                Accesses = new bool[] {x.Create, x.Edit, x.Delete, x.View },
                RoleName = x.Role.RoleName,
                ScreenName = x.Screen.ScreenName
            }).ToList();
            return access;
        }



    }
}
