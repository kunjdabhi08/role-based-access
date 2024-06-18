using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DataAccess.Models;
using DataAccess.Models.DTO;

namespace BusinessLogic.MapperProfile 
{
    public class MapperProfile : Profile
    {


        public MapperProfile() {
            CreateMap<User, UserDTO>();
            CreateMap<UserDTO, User>();
            CreateMap<Blog, BlogDTO>();
            CreateMap<BlogDTO, Blog>();
            CreateMap<Access, AccessDTO>();
        }
    }
}
