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


        /// <summary>
        /// this method is for deleting a user.
        /// </summary>
        /// <param name="id">id of the user to be deleted</param>
        /// <param name="screenId">will contain id of the screen from which request has been made</param>
        /// <returns>No content</returns>
        [CustomAuth("Delete", "SuperAdmin", "Admin")]
        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ResponseDTO<NoContent>>> Delete(int id, int screenId)
        {
            ResponseDTO<NoContent> res = new ResponseDTO<NoContent>();
            try
            {
                User? deleteUser = await _user.Delete(id);

                if (deleteUser == null)
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


        /// <summary>
        /// this method will return all the users in database and is not  deleted.
        /// </summary>
        /// <returns>list of all the user present in database and is not deleted</returns>
        [HttpGet]
        [CustomAuth("View", "SuperAdmin", "Admin")]
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


        /// <summary>
        /// this method will change the role of subscribed user to unsubscribed user if subscribe is false
        /// and will change unsubscribe to subscribe if subscribe param is true.
        /// </summary>
        /// <param name="id">id of the user which will be subscribed or unsubscribed</param>
        /// <param name="subscribe">if true then request for subscription and if false then request for unsubscription</param>
        /// <returns></returns>
        [HttpPost("{id:int}")]
        [CustomAuth("View", "Reader", "Subscribed Reader")]
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
