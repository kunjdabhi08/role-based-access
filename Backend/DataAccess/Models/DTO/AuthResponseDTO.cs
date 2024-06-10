using DataAccess.Models;
using DataAccess.Models.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Models.DTO
{
    public class AuthResponseDTO
    {
        public bool Success { get; set; }
        public string? Message { get; set; }

        public UserRespDTO? Data { get; set; }

        public string? Token { get; set; }

        public List<AccessDTO>? Permissions { get; set; }

        
    }
}
