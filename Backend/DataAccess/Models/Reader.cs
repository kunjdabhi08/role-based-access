using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataAccess.Models
{
    public class Reader
    {
        [Key]
        public int ReaderId { get; set; }

        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public User User { get; set; }

        [ForeignKey("User")]
        public int UserId {  get; set; }

        public bool IsSubscribed { get; set; }

    }
}
