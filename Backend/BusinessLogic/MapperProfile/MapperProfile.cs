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
            CreateMap<Blog, BlogDTO>()
                .ForMember(dest => dest.AuthorName, act => act.MapFrom(src => src.Author.Name))
                .ForMember(dest => dest.CreatedAt, act => act.MapFrom(src => src.CreatedDate.Date))
                .ForMember(dest => dest.TotalRatings, act => act.MapFrom(src => src.TotalReviews));
                
            CreateMap<BlogDTO, Blog>();
            CreateMap<Access, AccessDTO>()
                .ForMember(dest => dest.ScreenName, act => act.MapFrom(src => src.Screen.ScreenName))
                .ForMember(dest => dest.RoleName, act => act.MapFrom(src => src.Role.RoleName));
            CreateMap<User, UserRespDTO>()
                .ForMember(dest => dest.Name, act => act.MapFrom(src => src.Name))
                .ForMember(dest => dest.Email, act => act.MapFrom(src => src.Email))
                .ForMember(dest => dest.RoleId, act => act.MapFrom(src => src.RoleId))
                .ForMember(dest => dest.Id, act => act.MapFrom(src => src.UserId));
        }
    }
}
