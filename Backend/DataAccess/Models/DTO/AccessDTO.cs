using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Models.DTO
{
    public class AccessDTO
    {
        [Required(ErrorMessage = "RoleId is required")]
        public int RoleId {  get; set; }

        [Required(ErrorMessage = "ScreenId is required")]
        public int ScreenId { get; set; }

        public string RoleName { get; set; }

        public string ScreenName { get; set; }  

        public int? AccessId { get; set; }

        [Required(ErrorMessage = "Create Permission is required")]
        public bool Create { get; set; }

        [Required(ErrorMessage = "Edit Permission is required")]
        public bool Edit { get; set; }

        [Required(ErrorMessage = "Delete Permission is required")]
        public bool Delete { get; set; }

        [Required(ErrorMessage = "View Permission is required")]
        public bool View { get; set; }
    }
}
