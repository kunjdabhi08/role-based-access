
using DataAccess.Models;
using DataAccess.Models.DTO;
using BusinessLogic.Interfaces;
using Microsoft.AspNetCore.Mvc;

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

        /// <summary>
        /// this method will register user and add data to the database
        /// </summary>
        /// <param name="user">user will containe data of the user added by user</param>
        /// <returns>registered user data</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ResponseDTO<User>>> Register(UserDTO user)
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

                    User registeredUser = await _auth.Register(user);

                    response.Success = true;
                    response.Data = registeredUser;

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


        /// <summary>
        /// this method is for logging user in.
        /// it will match email and password and if matches it will return the user object which will caontain token and other details.
        /// if not matches it will return badrequest with error message, same if user is not found.
        /// </summary>
        /// <param name="email">email of the user</param>
        /// <param name="password">password of the user</param>
        /// <returns>logged in user data with authentication token</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<AuthResponseDTO>> Login(string email, string password)
            {
            AuthResponseDTO res = new AuthResponseDTO();
            try
            {
                if (email == null && password == null)
                {
                    throw new Exception("Something went wrong");
                }

                UserRespDTO? loggedInUser =await _auth.Login(email, password);
                if (loggedInUser == null)
                {
                    res.Success = false;
                    res.Message = "User does not exist";

                    return NotFound(res);
                }

                string token = _jwt.GenerateToken(email, loggedInUser.RoleName, (int)loggedInUser.RoleId);
                res.Success = true;
                res.Data = loggedInUser;
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
