using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.Interfaces
{
    public interface IJwtRepo
    {
        public string GenerateToken(string username, string role, int roleId);

        public bool ValidateToken(string token, out JwtSecurityToken jwttoken);
    }
}
