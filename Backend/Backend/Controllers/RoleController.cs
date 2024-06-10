using BusinessLogic.Interfaces;
using DataAccess.Models;
using DataAccess.Models.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/role")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRoleRepo _role;
        public RoleController(IRoleRepo role)
        {
            _role = role;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<ResponseDTO<List<Role>>> Get()
        {
            ResponseDTO<List<Role>> res = new ResponseDTO<List<Role>>();
            try
            {
                List<Role> roles = _role.Get();
                res.Success = true;
                res.Data = roles;

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
