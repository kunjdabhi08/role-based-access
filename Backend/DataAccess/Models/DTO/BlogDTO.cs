using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Models.DTO
{
    public class BlogDTO
    {

        public int? BlogId { get; set; }

        [Required(ErrorMessage = "Blog Name is required")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Blog content is required")]
        public string Content { get; set; }

        public string? AuthorName { get; set; }


        [Required(ErrorMessage = "Author is required")]
        public int AuthorId {  get; set; }

        public bool IsApproved { get; set; }

        public bool isPremium { get; set; }

        public DateTime? CreatedAt { get; set; }
    }
}
