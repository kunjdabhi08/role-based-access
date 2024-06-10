using DataAccess.Models;
using BusinessLogic.Interfaces;
using DataAccess.Models.DTO;
using Microsoft.AspNetCore.Mvc;

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


        [CustomAuth("Edit")]
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<ResponseDTO<Access>> Edit(AccessDTO access)
        {
            if (ModelState.IsValid)
            { 
                ResponseDTO<Access> res = new ResponseDTO<Access>();
                try
                {
                    if (access == null)
                    {
                        throw new Exception("Something went wrong");
                    }

                    Access editedAccess = _access.Edit(access.ScreenId, access.RoleId, access.Accesses);

                    if (editedAccess == null)
                    {
                        res.Success = false;
                        res.Message = "Access Data not found";

                        return NotFound(res);
                    }

                    res.Success = true;
                    res.Data = editedAccess;

                    return Ok(res);
                }
                catch (Exception ex)
                {
                    res.Success = false;
                    res.Message = ex.Message;

                    return BadRequest(res);
                }
            }
            return BadRequest(ModelState);
        }


        [HttpGet]
        [CustomAuth("View")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<ResponseDTO<List<AccessDTO>>> Get()
        {
            ResponseDTO<List<AccessDTO>> res = new ResponseDTO<List<AccessDTO>>();
            try
            {
                List<AccessDTO> accesses = _access.Get();
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
        
        [HttpGet("{roleid:int}")]
        [CustomAuth("View")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<ResponseDTO<List<AccessDTO>>> Get(int roleid)
        {
            ResponseDTO<List<AccessDTO>> res = new ResponseDTO<List<AccessDTO>>();
            try
            {
                List<AccessDTO> accesses = _access.Get(roleid);
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

    }
}
