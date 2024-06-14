using DataAccess.Models;
using BusinessLogic.Interfaces;
using DataAccess.Models.DTO;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using BusinessLogic.Common;

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


        /// <summary>
        /// method for creating blog for authors
        /// </summary>
        /// <param name="blog">contains data of the blog like title, content and isMemberOnly or not.</param>
        /// <param name="screenId">will contain id of the screen from which request has been made</param>
        /// <returns></returns>
        [CustomAuth("Create")]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ResponseDTO<Blog>>> Create(BlogDTO blog, int screenId)
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

                    Blog b = await _blog.Create(blog);
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


        /// <summary>
        /// will return blogs based on conditions. it is used for getting for user and for admin.
        /// if user makes request, user will get only approved blogs,
        /// if admin makes request, admin will get all the blogs including unapproved blogs
        /// </summary>
        /// <param name="screenId">will contain id of the screen from which request has been made</param>
        /// <param name="user">user is boolean field which will be true if user makes request</param>
        /// <returns></returns>
        [CustomAuth("View")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ResponseDTO<List<Blog>>>> Get(int screenId, bool user)
        {
            ResponseDTO<List<BlogDTO>> res = new ResponseDTO<List<BlogDTO>>();
            try
            {
                List<BlogDTO> blogs = await _blog.Get(null, user);
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

        /// <summary>
        /// this method will return a single blog based on provided id.
        /// </summary>
        /// <param name="id">the id of blog which needs to fetched</param>
        /// <param name="screenId">will contain id of the screen from which request has been made</param>
        /// <returns></returns>
        [CustomAuth("View")]
        [HttpGet("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ResponseDTO<BlogDTO>>> Get(int id, int screenId)
        {
            ResponseDTO<BlogDTO> res = new ResponseDTO<BlogDTO>();
            try
            {
                BlogDTO blog =  await _blog.Get(id);

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


        /// <summary>
        /// method for editing the blog
        /// </summary>
        /// <param name="blog">will contain fields title, content, id and isPremium</param>
        /// <param name="screenId">will contain id of the screen from which request has been made</param>
        /// <returns></returns>
        [CustomAuth("Edit")]
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ResponseDTO<Blog>>> Edit(BlogDTO blog, int screenId)
        {
            ResponseDTO<Blog> res = new ResponseDTO<Blog>();
            try
            {
                Blog? b = await _blog.Edit(blog);

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


        /// <summary>
        /// method for deleting the blog
        /// </summary>
        /// <param name="id">id of the blog which needs to be deleted</param>
        /// <param name="screenId">will contain id of the screen from which request has been made</param>
        /// <returns></returns>
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
                Blog? b = await _blog.Delete(id);

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


        /// <summary>
        /// will return only blogs that are writtern by the author of which id is provided
        /// </summary>
        /// <param name="screenId">will contain id of the screen from which request has been made</param>
        /// <param name="authorId">id of the author whose blogs to be fetched</param>
        /// <returns></returns>
        [HttpGet("{authorId:int}")]
        public async Task<ActionResult<ResponseDTO<List<Blog>>>> GetByAuthor(int screenId, int? authorId)
        {
            ResponseDTO<List<BlogDTO>> res = new ResponseDTO<List<BlogDTO>>();
            try
            {
                List<BlogDTO> blogs = await _blog.Get(authorId, false);
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


        /// <summary>
        /// this method will approve the blog and isApproved field in the database will be true for perticular blog
        /// </summary>
        /// <param name="blogId">id of blog which is to be approved</param>
        /// <param name="screenId">will contain id of the screen from which request has been made</param>
        /// <returns></returns>
        [CustomAuth("Edit")]
        [HttpPut("{blogId:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ResponseDTO<Blog>>> Approve(int blogId, int screenId)
        {
            ResponseDTO<Blog> res = new ResponseDTO<Blog>();
            try
            {
                Blog? b = await _blog.Approve(blogId);

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
