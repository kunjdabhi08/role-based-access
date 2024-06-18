using System.ComponentModel.DataAnnotations.Schema;

namespace DataAccess.Models
{
    public class Author: BaseClass
    {
        public int AuthorId { get; set; }

        public string Name { get; set; }

        public string Email {  get; set; }

        public User User { get; set; }

        [ForeignKey("User")]
        public int UserId {  get; set; }

        public int TotalBlogs { get; set; }

    }
}
