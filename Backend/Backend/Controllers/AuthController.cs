
using DataAccess.Models;
using DataAccess.Models.DTO;
using BusinessLogic.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using System.Diagnostics;

namespace Backend.Controllers
{
    [Route("api/auth")]
    [ApiController]

    public class AuthController : ControllerBase
    {
        private readonly IAuthRepo _auth;
        private readonly IJwtRepo _jwt;
        private readonly IAccessRepo _access;
        public AuthController(IAuthRepo auth, IJwtRepo jwt, IAccessRepo access)
        {
            _auth = auth;
            _jwt = jwt;
            _access = access;   

        }


        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<ResponseDTO<User>> Register(UserDTO user)
        {
            if (ModelState.IsValid)
            {
                ResponseDTO<User> response = new ResponseDTO<User>();
                try
                {
                    if (user == null)
                    {
                        throw new Exception("Something Went Wrong");
                    }

                    User u = _auth.Register(user);

                    response.Success = true;
                    response.Data = u;

                    return Ok(response);
                }
                catch (Exception ex)
                {
                    response.Success = false;
                    response.Message = ex.Message;

                    return BadRequest(response);
                }
            }
            return BadRequest(ModelState);

        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<AuthResponseDTO> Login(string email, string password)
            {
            AuthResponseDTO res = new AuthResponseDTO();
            try
            {
                if (email == null && password == null)
                {
                    throw new Exception("Something went wrong");
                }

                UserRespDTO? u = _auth.Login(email, password);
                if (u == null)
                {
                    res.Success = false;
                    res.Message = "User does not exist";

                    return NotFound(res);
                }

                string token = _jwt.GenerateToken(email, u.RoleName, (int)u.RoleId);
                List<AccessDTO> access = _access.Get((int)u.RoleId);
                res.Permissions = access;
                res.Success = true;
                res.Data = u;
                res.Token = token;
                return Ok(res);

            }
            catch (Exception ex)
            {
                res.Success = false;
                res.Message = ex.Message;

                return BadRequest(res);
            }
        }

        
    }
}
