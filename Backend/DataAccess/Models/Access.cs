using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataAccess.Models
{
    public class Access: BaseClass
    {
        [Key] 
        public int AccessId { get; set; }

        public Screen Screen { get; set; }

        [ForeignKey("Screen")]
        public int ScreenId { get; set; }

        public Role Role { get; set; }

        [ForeignKey("Role")]
        public int RoleId { get; set; }

        public bool Create {  get; set; }

        public bool Edit { get; set; }  

        public bool Delete { get; set; }    

        public bool View { get; set; }

        [ForeignKey("Screen.ScreenId")]    
        public int? ParentScreen { get; set; }

    }
}
