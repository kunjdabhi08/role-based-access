
using System.IdentityModel.Tokens.Jwt;
using DataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;

namespace BusinessLogic.Interfaces
{
    public class CustomAuth : Attribute, IAuthorizationFilter
    {
        private readonly string[] _access;
        public CustomAuth(params string[] access)
        {
            _access = access;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var jwtServices = context.HttpContext.RequestServices.GetService<IJwtRepo>();
            var accessService = context.HttpContext.RequestServices.GetService<IAccessRepo>();

            var sc = context.HttpContext.Request.Query["screenId"];

            if (jwtServices == null || accessService == null)
            {
                return;
            }


            var token = context.HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();


            if (token == null)
            {
                context.Result = new JsonResult("Not Authorized")
                {
                    Value = new
                    {
                        statusCode = 401,
                        Success = false,
                        Message = "Token not found"
                    }
                }; ;
                return;
            }

            if (!jwtServices.ValidateToken(token, out JwtSecurityToken validatedToken))
            {
                context.Result = new JsonResult("Not Authorized")
                {
                    Value = new
                    {
                        statusCode = 401,
                        Success = false,
                        Message = "Token is not valid"
                    }
                }; ;
                return;
            }

           

            var roleClaim = validatedToken.Claims.Where(m => m.Type == "roleId").FirstOrDefault();
            


            if (roleClaim == null)
            {
                context.Result = new JsonResult("Not Authorized")
                {
                    Value = new
                    {
                        statusCode = 401,
                        Success = false,
                        Message = "Something went wrong"
                    }
                }; ;
                return;
            }

            var roleType = roleClaim.Value;

            Access access = accessService.Get(Int32.Parse(roleType), Int32.Parse(sc));

            if (access == null || (_access.Contains("Create") && access?.Create == false) || (_access.Contains("Edit") && access?.Edit == false) || (_access.Contains("View") && access?.View == false) || (_access.Contains("Delete") && access?.Delete == false))
            {
                context.Result = new JsonResult("Forbidden")
                {
                    Value = new
                    {
                        statusCode = 403,
                        Success = false,
                        Message = "Permission Denied"
                    }
                };
                return;
            }

        }


    }
}
