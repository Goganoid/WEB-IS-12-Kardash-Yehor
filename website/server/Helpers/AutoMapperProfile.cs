using AutoMapper;
using MyPlan.Entities;
using MyPlan.Models;
using MyPlan.Models.Card;
using MyPlan.Models.Dashboard;
using MyPlan.Models.Column;
using MyPlan.Models.User;

namespace MyPlan.Helpers;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<User, UserModel>();
        CreateMap<RegisterModel, User>();
        CreateMap<UpdateModel, User>();

        CreateMap<DashboardModel, Dashboard>();

        CreateMap<ColumnModel, Column>();

        CreateMap<CardContentModel, Card>();
        CreateMap<CardPositionModel, Card>();
        
        CreateMap<Dashboard,DashboardDetailsRequest>();
        CreateMap<Dashboard,DashboardInfoRequest>();
        CreateMap<Column,ColumnDTO >();
        CreateMap<Card,CardDTO>();
        CreateMap<User,UserDTO>();
        CreateMap<Membership, MembershipDTO>();
    }
}
