using System.ComponentModel.DataAnnotations;

namespace DataAccess.Models
{
    public class Screen
    {
        [Key]
        public int ScreenId { get; set; }

        public string ScreenName { get; set; }

    }
}
