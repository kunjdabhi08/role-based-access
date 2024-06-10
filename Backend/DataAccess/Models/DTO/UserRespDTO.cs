using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Models.DTO
{
    public class UserRespDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }
       
        public string? Email { get; set; }

        public int? RoleId { get; set; }

        public string? RoleName { get; set; }

        public bool? IsSubscribed { get; set; }

        public int? AuthorId { get; set; }  
    }
}
