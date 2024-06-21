using DataAccess.Models;
using BusinessLogic.Interfaces;
using DataAccess.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using BusinessLogic.Common;

namespace Backend.Controllers
{
    [Route("api/access")]
    [ApiController]
    public class AccessController : ControllerBase
    {
        private readonly IAccessRepo _access;
        public AccessController(IAccessRepo access)
        {
            _access = access;
        }

        /// <summary>
        /// this action method is for editing access for every screen. it will take all the permission from database and will map the new permission form the access object provide in parameter
        /// </summary>
        /// <param name="access">access param is a list of screens along with its permission and screen id</param>
        /// <returns>edited access</returns>
        [CustomAuth("Edit", "SuperAdmin")]
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ResponseDTO<Access>>> Edit(List<AccessDTO> access)
        {
            if (ModelState.IsValid)
            { 
                ResponseDTO<List<AccessDTO>> res = new ResponseDTO<List<AccessDTO>>();
                try
                {
                    if (access == null)
                    {
                        throw new Exception("Something went wrong");
                    }

                    List<AccessDTO> editedAccess = await _access.Edit(access);

                    if (editedAccess == null)
                    {
                        res.Success = false;
                        res.Message = "Access Data not found";

                        return  NotFound(res);
                    }

                    res.Success = true;
                    res.Data = editedAccess;

                    return  Ok(res);
                }
                catch (Exception ex)
                {
                    res.Success = false;
                    res.Message = ex.Message;

                    return  BadRequest(res);
                }
            }
            return BadRequest(ModelState);
        }
        

        /// <summary>
        /// this action method will return all the screen for perticular role
        /// </summary>
        /// <param name="roleid">roleid will container id of the selected role</param>
        /// <returns>all the accesses in database with this role id</returns>
        [HttpGet("{roleid:int}")]
        [CustomAuth("View", "Admin", "SuperAdmin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ResponseDTO<List<AccessDTO>>>> Get(int roleid)
        {
            ResponseDTO<List<AccessDTO>> res = new ResponseDTO<List<AccessDTO>>();
            try
            {
                List<AccessDTO> accesses = await _access.Get(roleid);
                res.Success = true;
                res.Data = accesses;

                return Ok(res);
            }
            catch (Exception ex)
            {
                res.Success = false;
                res.Message = ex.Message;

                return BadRequest(res);
            }
        }


        /// <summary>
        /// this method will return permission for perticular screen and for perticular role.it will be called every time when any of the screen is loaded
        /// </summary>
        /// <param name="roleid">roleid is for id of the role for which we are getting the permission</param>
        /// <param name="screenid">screenid is id of the screen from which request has made</param>
        /// <returns>get access for perticular screen and perticular role</returns>
        [CustomAuth("Admin", "SuperAdmin", "Author", "Reader", "Subscribed Reader")]
        [HttpGet("{roleid:int}/{screenid:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public  ActionResult<ResponseDTO<Access>> Get(int roleid, int screenid)
        {
            ResponseDTO<Access> res = new ResponseDTO<Access>();
            try
            {
                Access access =  _access.Get(roleid, screenid);
                if(access == null)
                {
                    throw new Exception("Something went wrong");
                }

                res.Success = true;
                res.Data= access;

                return res;

            } catch(Exception ex)
            {
                res.Success = false;
                res.Message = ex.Message;

                return BadRequest(res);
            }
        }

    }
}
