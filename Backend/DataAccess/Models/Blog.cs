using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataAccess.Models
{
    public class Blog
    {
        [Key]
        public int BlogId { get; set; }

        [Required(ErrorMessage = "Title is required")]
        public string Title {  get; set; }

        [Required(ErrorMessage = "Blog content is required")]
        public string Content { get; set; }

        public Author Author { get; set; }

        [Required]
        [ForeignKey("Author")]
        public int AuthorId { get; set; }

        public bool IsApproved { get; set; }

        public bool IsDeleted { get; set; }

        public float Rating { get; set; }   

        public bool IsPremium { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime LastModifiedDate { get; set; }
    }
}
