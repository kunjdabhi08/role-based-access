using DataAccess.Models;
using DataAccess.Models.DTO;

namespace BusinessLogic.Interfaces
{
    public interface IBlogRepo
    {
        public Task<Blog> Create(BlogDTO blog);

        public Task<List<BlogDTO>> Get(int? authorId, bool user);

        public Task<BlogDTO> Get(int id);

        public Task<Blog?> Edit(BlogDTO blog);

        public Task<Blog> Delete(int id);

        public Task<Blog?> Approve(int blogId);

        public Task<Blog?> Rate(int blogId, int rating);
    }
}