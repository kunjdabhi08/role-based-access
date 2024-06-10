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

        [MaxLength(4)]
        public bool[] Accesses { get; set; }

        public string RoleName { get; set; }

        public string ScreenName { get; set; }  

        public int? AccessId { get; set; }
    }
}
