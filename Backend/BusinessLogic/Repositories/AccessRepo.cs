
using DataAccess.Models;
using BusinessLogic.Interfaces;
using DataAccess.Data;
using DataAccess.Models.DTO;
using Microsoft.EntityFrameworkCore;

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
            Access? access =  _dbContext.Accesses.FirstOrDefault(acc=> acc.RoleId == roleid && acc.ScreenId == screenid);
            return access;
        }


        public async Task<List<AccessDTO>>? Edit(List<AccessDTO> accesses)
        {
            foreach(AccessDTO access in accesses)
            {
                Access? accessToEdit = await _dbContext.Accesses.FirstOrDefaultAsync(acc => acc.RoleId == access.RoleId && acc.ScreenId == access.ScreenId);
                if (access != null)
                {
                    accessToEdit.Create = access.Create;
                    accessToEdit.Edit = access.Edit;
                    accessToEdit.Delete = access.Delete;
                    accessToEdit.View = access.View;

                    _dbContext.Accesses.Update(accessToEdit);
                    await _dbContext.SaveChangesAsync();
                }
            }
            

            return accesses;
        }

        
        public async Task<List<AccessDTO>> Get(int roleId)
        {
            List<AccessDTO> access =  await _dbContext.Accesses.Where(acc => acc.RoleId == roleId).Select(acc => new AccessDTO {
                AccessId = acc.AccessId,
                RoleId = acc.RoleId,
                ScreenId = acc.ScreenId,
                RoleName = acc.Role.RoleName,
                ScreenName = acc.Screen.ScreenName,
                Create = acc.Create,
                Delete = acc.Delete,
                View = acc.View,
                Edit = acc.Edit,
            }).ToListAsync();
            return access;
        }



    }
}
