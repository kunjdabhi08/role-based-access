using BusinessLogic.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BusinessLogic.Repositories
{
    public class JwtRepo: IJwtRepo
    {
        public IConfiguration Configuration { get; }
        public JwtRepo(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public string GenerateToken(string username, string role, int roleId)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(Configuration["jwt:key"]);


            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                new Claim(ClaimTypes.Email, username),
                new Claim(ClaimTypes.Role, role),
                new Claim("roleId" , roleId.ToString())
            }),


                Expires = DateTime.UtcNow.AddMinutes(Double.Parse(Configuration["jwt:Expiry"])),

                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key)
, SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public bool ValidateToken(string token, out JwtSecurityToken jwttoken)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(Configuration["Jwt:key"]);

            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero,
                }, out SecurityToken validatedToken);
                jwttoken = (JwtSecurityToken)validatedToken;

                if (jwttoken != null)
                {
                    return true;
                }
                return false;
            }
            catch
            {
                jwttoken = null;
                return false;
            }
        }
    }


   


}
