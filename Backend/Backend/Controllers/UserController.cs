using DataAccess.Models;
using DataAccess.Models.DTO;
using BusinessLogic.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using BusinessLogic.Common;

namespace Backend.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepo _user;
        public UserController(IUserRepo user)
        {
            _user = user;
        }

        [CustomAuth("Delete")]
        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ResponseDTO<NoContent>>> Delete(int id, int screenId)
        {
            ResponseDTO<NoContent> res = new ResponseDTO<NoContent>();
            try
            {
                User? u = await _user.Delete(id);

                if (u == null)
                {
                    res.Success = false;
                    res.Message = "User does not exist";
                    return NotFound(res);
                }

                res.Success = true;
                return Ok(res);
            }
            catch (Exception Ex)
            {
                res.Success = false;
                res.Message = Ex.Message;
                return BadRequest(res);
            }
        }

        [HttpGet]
        [CustomAuth("View")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ResponseDTO<List<UserRespDTO>>>> Get()
        {
            ResponseDTO<List<UserRespDTO>> res = new ResponseDTO<List<UserRespDTO>>();
            try
            {
                List<UserRespDTO> users = await _user.Get();
                res.Success = true;
                res.Data = users;
                return Ok(res);
            }
            catch (Exception Ex)
            {
                res.Success = false;
                res.Message = Ex.Message;
                return BadRequest(res);
            }
        }

        [HttpPost("{id:int}")]
        [CustomAuth("View")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ResponseDTO<NoContent>>> Subscribe(int id, int subscribe)
        {
            ResponseDTO<NoContent> res = new ResponseDTO<NoContent>();
            try
            {
                await _user.Subscribe(id, subscribe);
                res.Success = true;
                return Ok(res);
            }
            catch (Exception Ex)
            {
                res.Success = false;
                res.Message = Ex.Message;
                return BadRequest(res);
            }
        }
    }
}
