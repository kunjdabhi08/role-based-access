using DataAccess.Models;
using DataAccess.Models.DTO;

namespace BusinessLogic.Interfaces
{
    public interface IBlogRepo
    {
        public Blog Create(BlogDTO blog);

        public List<BlogDTO> Get(int? authorId, bool user);

        public BlogDTO Get(int id);

        public Blog? Edit(BlogDTO blog);

        public Blog Delete(int id);

        public Blog? Approve(int blogId);
    }
}