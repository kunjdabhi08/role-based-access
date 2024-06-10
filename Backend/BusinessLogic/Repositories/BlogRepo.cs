using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Models;
using BusinessLogic.Interfaces;
using DataAccess.Data;
using DataAccess.Models.DTO;

namespace BusinessLogic.Repositories
{
    public class BlogRepo : IBlogRepo
    {
        private readonly AppDBContext _dbContext;
        public BlogRepo(AppDBContext dBContext) { 
            _dbContext = dBContext;
        }

        public Blog Create(BlogDTO blog)
        {
            Blog b = new Blog
            {
                Title = blog.Title,
                Content = blog.Content,
                AuthorId = blog.AuthorId,
                CreatedDate = DateTime.UtcNow,
                LastModifiedDate = DateTime.UtcNow,
                IsApproved = false,
                IsPremium = blog.isPremium,
            };

            _dbContext.Blogs.Add(b);
            _dbContext.SaveChanges();

            return b;
        }

        public List<BlogDTO> Get(int? authorId, bool user)
        {
            List<BlogDTO> blogs = _dbContext.Blogs.Where(x=>x.IsDeleted == false).Select(x => new BlogDTO { 
                Title = x.Title,
                Content = x.Content,
                IsApproved = x.IsApproved,
                isPremium = x.IsPremium,    
                AuthorName = x.Author.Name,
                AuthorId = x.AuthorId ,
                BlogId = x.BlogId,
                CreatedAt = x.CreatedDate.Date,
            }).ToList();

            if(authorId != null)
            {
                int id = _dbContext.Authors.FirstOrDefault(author => author.UserId == (int)authorId).AuthorId;
                return blogs.Where(blog => blog.AuthorId == id).ToList();
            }

            if (user)
            {
                return blogs.Where(blog => blog.IsApproved == true).ToList();
            }

            return blogs;
        }

        public BlogDTO? Get(int id)
        {
            Blog? x = _dbContext.Blogs.FirstOrDefault(y=> y.BlogId == id && y.IsDeleted == false);

            if(x != null)
            {
                BlogDTO b = new BlogDTO
                {
                    BlogId = x.BlogId,
                    Title = x.Title,
                    Content = x.Content,
                    IsApproved = x.IsApproved,
                    isPremium = x.IsPremium,
                    AuthorName = _dbContext.Authors.FirstOrDefault(a=>a.AuthorId == x.AuthorId).Name,
                    AuthorId = x.AuthorId,
                    CreatedAt = x.CreatedDate.Date,
                };

                return b;
            }

            return null;
        }

        public Blog? Edit(BlogDTO blog)
        {
            Blog? b = _dbContext.Blogs.FirstOrDefault(x=>x.BlogId == blog.BlogId && x.IsDeleted == false);

            if(b != null)
            {
                b.Title = blog.Title;
                b.Content = blog.Content;
                b.IsPremium = blog.isPremium;

                _dbContext.Blogs.Update(b);
                _dbContext.SaveChanges();   
            }

            return b;

        }

        public Blog? Delete(int id)
        {
            Blog blog = _dbContext.Blogs.FirstOrDefault(x=>x.BlogId==id && x.IsDeleted == false);
            if(blog != null)
            {
                blog.IsDeleted = true;
                _dbContext.Blogs.Update(blog);
                _dbContext.SaveChanges();
            }
            return blog;
        }


        public Blog? Approve(int blogId)
        {
            Blog? b = _dbContext.Blogs.FirstOrDefault(x => x.BlogId == blogId && x.IsDeleted == false);

            if (b != null)
            {
               b.IsApproved = true;

                _dbContext.Blogs.Update(b);
                _dbContext.SaveChanges();
            }

            return b;

        }



    }
}
