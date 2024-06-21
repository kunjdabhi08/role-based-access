
using DataAccess.Models;
using BusinessLogic.Interfaces;
using DataAccess.Data;
using DataAccess.Models.DTO;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace BusinessLogic.Repositories
{
    public class AccessRepo : IAccessRepo
    {
        
        private readonly AppDBContext _dbContext;
        private readonly IMapper _mapper;
        public AccessRepo(AppDBContext context, IMapper mapper)
        {
            _dbContext = context;
            _mapper = mapper;
        }

        public Access? Get(int roleid, int screenid)
        {
            Access? access =  _dbContext.Accesses.FirstOrDefault(acc=> acc.RoleId == roleid && acc.ScreenId == screenid);
            return access;
        }


        public async Task<List<AccessDTO>>? Edit(List<AccessDTO> accesses)
        {
            List<Access?> accessToEdit = await _dbContext.Accesses.Where(acc => acc.RoleId == accesses[0].RoleId).ToListAsync();
            foreach (Access access in accessToEdit)
            {
                AccessDTO? editedAccess = accesses.Where(acc=> acc.RoleId == access.RoleId && acc.ScreenId == access.ScreenId).FirstOrDefault();
                if (editedAccess != null)
                {
                    access.Create = editedAccess.Create;
                    access.Edit = editedAccess.Edit;
                    access.Delete = editedAccess.Delete;
                    access.View = editedAccess.View;
                }
                if(editedAccess != null && editedAccess.ChildScreens.Count > 0)
                {
                    foreach(AccessDTO child in  editedAccess.ChildScreens)
                    {
                        Access childToEdit = accessToEdit.Where(ch => ch.RoleId == child.RoleId && ch.ScreenId == child.ScreenId).FirstOrDefault();
                        if(childToEdit != null) {
                            childToEdit.Create = !access.Create ? access.Create : child.Create;
                            childToEdit.Edit = !access.Edit ? access.Edit : child.Edit;
                            childToEdit.Delete = !access.Delete ? access.Delete : child.Delete;
                            childToEdit.View = !access.View ? access.View : child.View;
                        }
                    }
                }
            }
            _dbContext.Accesses.UpdateRange(accessToEdit);
            await _dbContext.SaveChangesAsync();
            

            return accesses;
        }

        
        public async Task<List<AccessDTO>> Get(int roleId)
        {
            List<AccessDTO> access = await _dbContext.Accesses.Where(acc => acc.RoleId == roleId && acc.ParentScreen == null).Select(acc => new AccessDTO
            {
                AccessId = acc.AccessId,
                RoleId = acc.RoleId,
                ScreenId = acc.ScreenId,
                RoleName = acc.Role.RoleName,
                ScreenName = acc.Screen.ScreenName,
                Create = acc.Create,
                Delete = acc.Delete,
                View = acc.View,
                Edit = acc.Edit,
                ChildScreens = _dbContext.Accesses.Where(per => per.ParentScreen == acc.ScreenId).Select(per => new AccessDTO
                {
                    RoleId = per.RoleId,
                    ScreenId = per.ScreenId,
                    AccessId = per.AccessId,
                    ScreenName = per.Screen.ScreenName,
                    Create = per.Create,
                    Delete = per.Delete,
                    View = per.View,
                    Edit = per.Edit,
                }).ToList(),
            }).ToListAsync();
            return access;
        }



    }
}
