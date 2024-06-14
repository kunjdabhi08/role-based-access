using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessLogic.Interfaces;
using DataAccess.Data;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace BusinessLogic.Repositories
{
    public class RoleRepo : IRoleRepo
    {
        private readonly AppDBContext _dbContext;
        public RoleRepo(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }


        public async Task<List<Role>> Get()
        {
            return await _dbContext.Roles.ToListAsync();
        }

    }
}
