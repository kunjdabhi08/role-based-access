using DataAccess.Models;
using BusinessLogic.Interfaces;
using DataAccess.Models.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/blogs/[action]")]
    [ApiController]
    //[CustomAuth]
    public class BlogController : ControllerBase
    {
        private readonly IBlogRepo _blog;
        public BlogController(IBlogRepo blog)
        {
            _blog = blog;
        }

        [CustomAuth("Create")]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<ResponseDTO<Blog>> Create(BlogDTO blog, int screenId)
        {
            if (ModelState.IsValid)
            {

                ResponseDTO<Blog> res = new ResponseDTO<Blog>();
                try
                {
                    if (blog == null)
                    {
                        throw new Exception("Something went wrong");
                    }

                    Blog b = _blog.Create(blog);
                    res.Success = true;
                    res.Data = b;

                    return Ok(res);
                }
                catch (Exception ex)
                {
                    res.Success = false;
                    res.Message = ex.Message;
                    return BadRequest(ex);
                }
            }
            return BadRequest(ModelState);
        }

        [CustomAuth("View")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<ResponseDTO<List<Blog>>> Get(int screenId, bool user)
        {
            ResponseDTO<List<BlogDTO>> res = new ResponseDTO<List<BlogDTO>>();
            try
            {
                List<BlogDTO> blogs = _blog.Get(null, user);
                res.Success = true;
                res.Data = blogs;
                return Ok(res);
            }
            catch (Exception Ex)
            {
                res.Success = false;
                res.Message = Ex.Message;
                return BadRequest(res);
            }
        }

        [CustomAuth("View")]
        [HttpGet("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<ResponseDTO<BlogDTO>> Get(int id, int authorid, int screenId)
        {
            ResponseDTO<BlogDTO> res = new ResponseDTO<BlogDTO>();
            try
            {
                BlogDTO blog = _blog.Get(id);

                if (blog == null)
                {
                    res.Success = false;
                    res.Message = "Blog does not exist";
                    return NotFound(res);
                }

                res.Success = true;
                res.Data = blog;
                return Ok(res);
            }
            catch (Exception Ex)
            {
                res.Success = false;
                res.Message = Ex.Message;
                return BadRequest(res);
            }
        }

        [CustomAuth("Edit")]
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<ResponseDTO<Blog>> Edit(BlogDTO blog, int screenId)
        {
            ResponseDTO<Blog> res = new ResponseDTO<Blog>();
            try
            {
                Blog? b = _blog.Edit(blog);

                if (b == null)
                {
                    res.Success = false;
                    res.Message = "Blog does not exist";
                    return NotFound(res);
                }

                res.Success = true;
                res.Data = b;
                return Ok(res);
            }
            catch (Exception Ex)
            {
                res.Success = false;
                res.Message = Ex.Message;
                return BadRequest(res);
            }
        }

        [CustomAuth("Delete")]
        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<ResponseDTO<NoContent>> Delete(int id, int screenId)
        {
            ResponseDTO<NoContent> res = new ResponseDTO<NoContent>();
            try
            {
                Blog? b = _blog.Delete(id);

                if (b == null)
                {
                    res.Success = false;
                    res.Message = "Blog does not exist";
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

        [HttpGet("{authorId:int}")]
        public ActionResult<ResponseDTO<List<Blog>>> GetByAuthor(int screenId, int? authorId)
        {
            ResponseDTO<List<BlogDTO>> res = new ResponseDTO<List<BlogDTO>>();
            try
            {
                List<BlogDTO> blogs = _blog.Get(authorId, false);
                res.Success = true;
                res.Data = blogs;
                return Ok(res);
            }
            catch (Exception Ex)
            {
                res.Success = false;
                res.Message = Ex.Message;
                return BadRequest(res);
            }

        }

        [CustomAuth("Edit")]
        [HttpPut("{blogId:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<ResponseDTO<Blog>> Approve(int blogId, int screenId)
        {
            ResponseDTO<Blog> res = new ResponseDTO<Blog>();
            try
            {
                Blog? b = _blog.Approve(blogId);

                if (b == null)
                {
                    res.Success = false;
                    res.Message = "Blog does not exist";
                    return NotFound(res);
                }

                res.Success = true;
                res.Data = b;
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
