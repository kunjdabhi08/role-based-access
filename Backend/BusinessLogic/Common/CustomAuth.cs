
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using BusinessLogic.Interfaces;
using DataAccess.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace BusinessLogic.Common
{
    public class CustomAuth : Attribute, IAuthorizationFilter
    {
        private readonly string[] _access;
        public CustomAuth(params string[] access)
        {
            _access = access;
        }

        public async void OnAuthorization(AuthorizationFilterContext context)
        {
            var jwtServices = context.HttpContext.RequestServices.GetService<IJwtRepo>();
            var accessService = context.HttpContext.RequestServices.GetService<IAccessRepo>();


            if (jwtServices == null || accessService == null)
            {
                return;
            }



            var token = context.HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();


            if (token == null)
            {
                context.Result = new JsonResult(new
                {
                    Success = false,
                    Message = "Token not found"
                })
                {
                    StatusCode = StatusCodes.Status401Unauthorized
                };
                return;
            }

            if (!jwtServices.ValidateToken(token, out JwtSecurityToken validatedToken))
            {
                context.Result = new JsonResult(new
                {
                    Success = false,
                    Message = "Token is not valid"
                })
                {
                    StatusCode = StatusCodes.Status401Unauthorized
                };
                return;
            }



            var roleClaim = validatedToken.Claims.Where(m => m.Type == "roleId").FirstOrDefault();
            var roleName = validatedToken.Claims.Where(m=>m.Type == "role").FirstOrDefault().Value;


            if (roleClaim == null)
            {
                context.Result = new JsonResult(new
                {
                    Success = false,
                    Message = "Something went wrong"
                })
                {
                    StatusCode = StatusCodes.Status401Unauthorized
                };
                return;
            }

            var roleType = roleClaim.Value;

            if (!_access.Contains(roleName))
            {
                context.Result = new JsonResult(new
                {
                    Success = false,
                    Message = "Unauthorized"
                })
                {
                    StatusCode = StatusCodes.Status403Forbidden
                };
                return;
            }


            if (_access.Contains("Create") || _access.Contains("Edit") || _access.Contains("Delete") || _access.Contains("View"))
            {
                var sc = context.HttpContext.Request.Query["screenId"];
                Access access = accessService.Get(int.Parse(roleType), int.Parse(sc));

                if (access != null && (_access.Contains("Create") && access?.Create == false || _access.Contains("Edit") && access?.Edit == false || _access.Contains("View") && access?.View == false || _access.Contains("Delete") && access?.Delete == false))
                {
                    context.Result = new JsonResult(new
                    {
                        Success = false,
                        Message = "Permission Denied"
                    })
                    {
                        StatusCode = StatusCodes.Status403Forbidden
                    };
                    return;
                }
            }

        }


    }
}
