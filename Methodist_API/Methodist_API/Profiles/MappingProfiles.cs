﻿using AutoMapper;
using Methodist_API.Dtos.Account;
using Methodist_API.Dtos.CreateEntity;
using Methodist_API.Dtos.DB;
using Methodist_API.Dtos.Patch;
using Methodist_API.Models.DB;
using Profile = Methodist_API.Models.DB.Profile;

namespace Methodist_API.Profiles
{
    public class MappingProfiles: AutoMapper.Profile
    {
        public MappingProfiles() 
        {
            //Profile
            CreateMap<Profile, NewProfileDto>().ReverseMap();
            CreateMap<Profile, RegisterDto>().ReverseMap();
            CreateMap<Profile, ProfileInfoDto>().ReverseMap();
            CreateMap<Profile, ProfileDto>().ReverseMap();
            //Event
            CreateMap<Event, CreateEventDto>().ReverseMap();
            CreateMap<Event, PatchEventDto>().ReverseMap();
            CreateMap<Event, EventDto>().ReverseMap();
            CreateMap<Event, EventDetailsDto>().ReverseMap();
            //MethodicalСommittee
            CreateMap<MethodicalСommittee, CreateMKDto>().ReverseMap();
            //FileEvent
            CreateMap<FileEvent, CreateFileEventDto>().ReverseMap();
            //TypeOfEvent
            CreateMap<TypeOfEvent, TypeOfEventDto>().ReverseMap();
        }
    }
}
