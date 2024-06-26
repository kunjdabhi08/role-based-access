﻿using DataAccess.Models;
using BusinessLogic.Interfaces;
using DataAccess.Data;
using DataAccess.Models.DTO;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace BusinessLogic.Repositories
{
    public class BlogRepo : IBlogRepo
    {
        private readonly AppDBContext _dbContext;
        private readonly IMapper _mapper;
        public BlogRepo(AppDBContext dBContext, IMapper mapper)
        {
            _dbContext = dBContext;
            _mapper = mapper;

        }

        public async Task<Blog> Create(BlogDTO blog)
        {
            Blog b = _mapper.Map<Blog>(blog);
            b.CreatedDate = DateTime.UtcNow;
            b.LastModifiedDate = DateTime.UtcNow;

            await _dbContext.Blogs.AddAsync(b);
            await _dbContext.SaveChangesAsync();

            return b;
        }

        public async Task<List<BlogDTO>> Get(int? authorId, bool user)
        {
            IQueryable<Blog> query = _dbContext.Blogs.Where(blog => !blog.IsDeleted);

            if (user)
            {
                query = query.Where(blog => blog.IsApproved);
            }
            else if (authorId.HasValue)
            {
                int authorDbId = (await _dbContext.Authors.Where(author => author.UserId == authorId.Value).Select(author => author.AuthorId).FirstOrDefaultAsync());

                query = query.Where(blog => blog.AuthorId == authorDbId);
            }

            List<BlogDTO> blogs = _mapper.Map<List<BlogDTO>>(await query.Select(blog => new BlogDTO
            {
                Title = blog.Title,
                Content = blog.Content,
                IsApproved = blog.IsApproved,
                IsPremium = blog.IsPremium,
                AuthorName = blog.Author.Name,
                AuthorId = blog.AuthorId,
                BlogId = blog.BlogId,
                CreatedAt = blog.CreatedDate.Date,
            }).ToListAsync());

            return blogs;
        }


        public async Task<BlogDTO?> Get(int id)
        {
            Blog? blog = await _dbContext.Blogs.FirstOrDefaultAsync(blog => blog.BlogId == id && blog.IsDeleted == false);

            if (blog != null)
            {
                BlogDTO b = _mapper.Map<BlogDTO>(blog);
                b.AuthorName = (await _dbContext.Authors.FirstOrDefaultAsync(author => author.AuthorId == blog.AuthorId)).Name;
                b.Rating = blog.Rating;
                b.TotalRatings = blog.TotalReviews;

                return b;
            }

            return null;
        }

        public async Task<Blog?> Edit(BlogDTO blog)
        {
            Blog? blogToEdit = await _dbContext.Blogs.FirstOrDefaultAsync(blogInDb => blogInDb.BlogId == blog.BlogId && blogInDb.IsDeleted == false);

            if (blogToEdit != null)
            {
                blogToEdit.Title = blog.Title;
                blogToEdit.Content = blog.Content;
                blogToEdit.IsPremium = blog.IsPremium;

                _dbContext.Blogs.Update(blogToEdit);
                await _dbContext.SaveChangesAsync();
            }

            return blogToEdit;
        }


        public async Task<Blog?> Delete(int id)
        {
            Blog? blog = await _dbContext.Blogs.FirstOrDefaultAsync(blog => blog.BlogId == id && blog.IsDeleted == false);
            if (blog != null)
            {
                blog.IsDeleted = true;
                _dbContext.Blogs.Update(blog);
                await _dbContext.SaveChangesAsync();
            }
            return blog;
        }

        public async Task<Blog?> Approve(int blogId)
        {
            Blog? blog = await _dbContext.Blogs.FirstOrDefaultAsync(blog => blog.BlogId == blogId && blog.IsDeleted == false);

            if (blog != null)
            {
                blog.IsApproved = true;

                _dbContext.Blogs.Update(blog);
                await _dbContext.SaveChangesAsync();
            }

            return blog;
        }


        public async Task<Blog?> Rate(int blogId,int rating)
        {
            Blog? blog = await _dbContext.Blogs.FirstOrDefaultAsync(blog => blog.BlogId == blogId && blog.IsDeleted == false);

            if (blog != null)
            {
                float sum = (blog.Rating * blog.TotalReviews) + rating;
                int totalReviews = blog.TotalReviews;
                totalReviews++;


                blog.Rating = sum / totalReviews;

                blog.TotalReviews = totalReviews;

                _dbContext.Blogs.Update(blog);
                await _dbContext.SaveChangesAsync();
            }

            return blog;
        }
    }
}
