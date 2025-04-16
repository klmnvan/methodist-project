using AutoMapper;
using FluentAssertions;
using Methodist_API.Controllers;
using Methodist_API.Data;
using Methodist_API.Dtos.Account;
using Methodist_API.Interfaces;
using Methodist_API.Models.Identity;
using Methodist_API.Profiles;
using Methodist_API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System.Security.Claims;
using Xunit;
using Assert = Xunit.Assert;

namespace Tests
{
    
    public class AccountControllerTests
    {
        private readonly ITokenService _tokenService;
        private readonly MKDbContext _context;
        private readonly ILogger<AccountController> _logger;
        private Guid idProfile;
        private readonly IMapper _mapper;
        public AccountControllerTests()
        {
            _logger = new Mock<ILogger<AccountController>>().Object;
            _mapper = CreateRealMapper();
            var config = new Mock<IConfiguration>();
            config.Setup(c => c["JWT:SigningKey"]).Returns("2a3b4c5d6e7f8g9h1j0klmnpqrs0tuvwx1yz234567890abcde[ghij1klmnopqrstuvwxyz");
            _tokenService = new TokenService(config.Object);
            _context = GetDatabaseContext().Result;
        }

        private IMapper CreateRealMapper()
        {
            var configuration = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<MappingProfiles>(); // Добавляем ваш профиль
            });

            return configuration.CreateMapper(); // Возвращаем реальный IMapper
        }

        private async Task<MKDbContext> GetDatabaseContext()
        {

            var options = new DbContextOptionsBuilder<MKDbContext>()
                    .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                    .Options;
            var databaseContext = new MKDbContext(options);
            databaseContext.Database.EnsureCreated();

            //Заполняем базу данных 
            if (await databaseContext.Users.CountAsync() <= 0)
            {
                idProfile = Guid.NewGuid();
                databaseContext.Profiles.Add(
                    new Methodist_API.Models.DB.Profile()
                    {
                        Id = idProfile,
                        FirstName = "Иван",
                        LastName = "Иванов",
                        Patronymic = "Иванович",
                        MC_id = null,
                        ImageUrl = null,
                        AppUser = new AppUser()
                        {
                            Id = idProfile,
                            Email = "ivanivanovich@example.com"
                        }
                    });
                await databaseContext.SaveChangesAsync();

            }
            return databaseContext;
        }

        //Тестирование регистрации
        [Fact]
        public async Task AccountControllerTests_Register_ReturnOKAsync()
        {
            //Arrange
            var dto = new RegisterDto()
            {
                FirstName = "Татьяна",
                LastName = "Иванова",
                Patronymic = "Ивановна",
                Email = "ivanovna@example.com",
                Password = "12345678",
                ConfirmPassword = "12345678",
            };

            //Mocks
            var userManagerMock = new Mock<UserManager<AppUser>>(
                new Mock<IUserStore<AppUser>>().Object,
                new Mock<IOptions<IdentityOptions>>().Object,
                new Mock<IPasswordHasher<AppUser>>().Object,
                new IUserValidator<AppUser>[0],
                new IPasswordValidator<AppUser>[0],
                new Mock<ILookupNormalizer>().Object,
                new Mock<IdentityErrorDescriber>().Object,
                new Mock<IServiceProvider>().Object,
                new Mock<ILogger<UserManager<AppUser>>>().Object);
            userManagerMock
                .Setup(userManager => userManager
                .CreateAsync(It.IsAny<AppUser>(), It.IsAny<string>()))
                .Returns(Task.FromResult(IdentityResult.Success));
            userManagerMock
                .Setup(um => um.AddToRoleAsync(It.IsAny<AppUser>(), It.IsAny<string>()))
                .Returns(Task.FromResult(IdentityResult.Success));
            userManagerMock
                .Setup(um => um.FindByEmailAsync(dto.Email)).
                ReturnsAsync(new AppUser { UserName = dto.Email, Email = dto.Email });

            var signInManager = new Mock<SignInManager<AppUser>>(
                userManagerMock.Object, Mock.Of<IHttpContextAccessor>(),
                Mock.Of<IUserClaimsPrincipalFactory<AppUser>>(), null, null, null, null);

            var controller = new AccountController(userManagerMock.Object, _tokenService, _context, signInManager.Object, _logger, _mapper);

            //Act
            var result = await controller.Register(dto);

            //Assert
            if (result is OkObjectResult okResult)
            {
                var resultDto = (NewProfileDto)okResult.Value;
                var newUserInContext = _context.Profiles.FirstOrDefault(it => it.Id == resultDto.Id);
                Assert.NotNull(newUserInContext);
            }
            result.Should().NotBeNull();
            result.Should().BeAssignableTo<OkObjectResult>();
        }

        //Тестирование регистрации при уже существующем пользователе
        [Fact]
        public async Task AccountControllerTests_Register_ReturnBadRequest()
        {
            //Arrange
            //Пользователь, который уже есть в БД, создан в контексте
            var dto = new RegisterDto()
            {
                FirstName = "Иван",
                LastName = "Иванов",
                Patronymic = "Иванович",
                Email = "ivanivanovich@example.com",
                Password = "12345678",
                ConfirmPassword = "12345678",
            };

            //Mocks
            var userManagerMock = new Mock<UserManager<AppUser>>(
                new Mock<IUserStore<AppUser>>().Object,
                new Mock<IOptions<IdentityOptions>>().Object,
                new Mock<IPasswordHasher<AppUser>>().Object,
                new IUserValidator<AppUser>[0],
                new IPasswordValidator<AppUser>[0],
                new Mock<ILookupNormalizer>().Object,
                new Mock<IdentityErrorDescriber>().Object,
                new Mock<IServiceProvider>().Object,
                new Mock<ILogger<UserManager<AppUser>>>().Object);
            userManagerMock
                .Setup(userManager => userManager
                .CreateAsync(It.IsAny<AppUser>(), It.IsAny<string>()))
                .Returns(Task.FromResult(IdentityResult.Failed(new IdentityError { Code = "DuplicateUserName" })));
            userManagerMock
                .Setup(um => um.AddToRoleAsync(It.IsAny<AppUser>(), It.IsAny<string>()))
                .Returns(Task.FromResult(IdentityResult.Success));
            userManagerMock
                .Setup(um => um.FindByEmailAsync(dto.Email)).
                ReturnsAsync(new AppUser { UserName = dto.Email, Email = dto.Email });

            var signInManager = new Mock<SignInManager<AppUser>>(
                userManagerMock.Object, Mock.Of<IHttpContextAccessor>(),
                Mock.Of<IUserClaimsPrincipalFactory<AppUser>>(), null, null, null, null);

            var controller = new AccountController(userManagerMock.Object, _tokenService, _context, signInManager.Object, _logger, _mapper);

            //Act
            var result = await controller.Register(dto);

            //Assert
            result.Should().NotBeNull();
            result.Should().BeAssignableTo<BadRequestObjectResult>();
        }

        //Тестирование авторизации и получения токена
        [Fact]
        public async Task AccountControllerTests_Login_ReturnOKAsyncAndToken()
        {
            //Arrange
            var dto = new LoginDto()
            {
                Email = "ivanivanovich@example.com",
                Password = "12345678",
                Device = ""
            };

            //Mocks
            var userManagerMock = new Mock<UserManager<AppUser>>(
                new Mock<IUserStore<AppUser>>().Object,
                new Mock<IOptions<IdentityOptions>>().Object,
                new Mock<IPasswordHasher<AppUser>>().Object,
                new IUserValidator<AppUser>[0],
                new IPasswordValidator<AppUser>[0],
                new Mock<ILookupNormalizer>().Object,
                new Mock<IdentityErrorDescriber>().Object,
                new Mock<IServiceProvider>().Object,
                new Mock<ILogger<UserManager<AppUser>>>().Object);
            userManagerMock
                .Setup(userManager => userManager
                .CreateAsync(It.IsAny<AppUser>(), It.IsAny<string>()))
                .Returns(Task.FromResult(IdentityResult.Success));
            userManagerMock
                .Setup(um => um.AddToRoleAsync(It.IsAny<AppUser>(), It.IsAny<string>()))
                .Returns(Task.FromResult(IdentityResult.Success));
            userManagerMock
                .Setup(um => um.FindByEmailAsync(dto.Email)).
                ReturnsAsync(new AppUser { UserName = dto.Email, Email = dto.Email, Id = idProfile });

            var signInManager = new Mock<SignInManager<AppUser>>(
                userManagerMock.Object, Mock.Of<IHttpContextAccessor>(),
                Mock.Of<IUserClaimsPrincipalFactory<AppUser>>(), null, null, null, null);

            signInManager
                .Setup(s => s.CheckPasswordSignInAsync(It.IsAny<AppUser>(), dto.Password, false))
                .ReturnsAsync(Microsoft.AspNetCore.Identity.SignInResult.Success);

            var controller = new AccountController(userManagerMock.Object, _tokenService, _context, signInManager.Object, _logger, _mapper);

            //Act
            var result = await controller.Login(dto);

            //Assert
            if (result is OkObjectResult okResult)
            {
                var resultDto = (NewProfileDto)okResult.Value;
                Assert.NotNull(resultDto.Token);
            }
            result.Should().NotBeNull();
            result.Should().BeAssignableTo<OkObjectResult>();
        }

        //Тестирование авторизации при неправильном пароле
        [Fact]
        public async Task AccountControllerTests_Login_ReturnUnauthorized()
        {
            //Arrange
            var dto = new LoginDto()
            {
                Email = "ivanivanovich@example.com",
                Password = "invalidpassword",
            };

            //Mocks
            var userManagerMock = new Mock<UserManager<AppUser>>(
                new Mock<IUserStore<AppUser>>().Object,
                new Mock<IOptions<IdentityOptions>>().Object,
                new Mock<IPasswordHasher<AppUser>>().Object,
                new IUserValidator<AppUser>[0],
                new IPasswordValidator<AppUser>[0],
                new Mock<ILookupNormalizer>().Object,
                new Mock<IdentityErrorDescriber>().Object,
                new Mock<IServiceProvider>().Object,
                new Mock<ILogger<UserManager<AppUser>>>().Object);
            userManagerMock
                .Setup(userManager => userManager
                .CreateAsync(It.IsAny<AppUser>(), It.IsAny<string>()))
                .Returns(Task.FromResult(IdentityResult.Success));
            userManagerMock
                .Setup(um => um.AddToRoleAsync(It.IsAny<AppUser>(), It.IsAny<string>()))
                .Returns(Task.FromResult(IdentityResult.Success));
            userManagerMock
                .Setup(um => um.FindByEmailAsync(dto.Email)).
                ReturnsAsync(new AppUser { UserName = dto.Email, Email = dto.Email, Id = idProfile });

            var signInManager = new Mock<SignInManager<AppUser>>(
                userManagerMock.Object, Mock.Of<IHttpContextAccessor>(),
                Mock.Of<IUserClaimsPrincipalFactory<AppUser>>(), null, null, null, null);

            signInManager
                .Setup(s => s.CheckPasswordSignInAsync(It.IsAny<AppUser>(), dto.Password, false))
                .ReturnsAsync(Microsoft.AspNetCore.Identity.SignInResult.Failed);

            var controller = new AccountController(userManagerMock.Object, _tokenService, _context, signInManager.Object, _logger, _mapper);

            //Act
            var result = await controller.Login(dto);

            //Assert
            result.Should().NotBeNull();
            result.Should().BeAssignableTo<UnauthorizedObjectResult>();
        }

        //Тестирование получения информации
        [Fact]
        public async Task AccountControllerTests_AccountInfo_ReturnOKAsync()
        {
            //Mocks
            var userManagerMock = new Mock<UserManager<AppUser>>(
                new Mock<IUserStore<AppUser>>().Object,
                new Mock<IOptions<IdentityOptions>>().Object,
                new Mock<IPasswordHasher<AppUser>>().Object,
                new IUserValidator<AppUser>[0],
                new IPasswordValidator<AppUser>[0],
                new Mock<ILookupNormalizer>().Object,
                new Mock<IdentityErrorDescriber>().Object,
                new Mock<IServiceProvider>().Object,
                new Mock<ILogger<UserManager<AppUser>>>().Object);
            userManagerMock
                .Setup(um => um.FindByNameAsync("ivanivanovich@example.com")).
                ReturnsAsync(new AppUser { UserName = "ivanivanovich@example.com", Email = "ivanivanovich@example.com", Id = idProfile });
            userManagerMock
                .Setup(um => um.GetRolesAsync(It.IsAny<AppUser>()))
                .ReturnsAsync(new List<string> { "User" });

            var signInManager = new Mock<SignInManager<AppUser>>(
                userManagerMock.Object, Mock.Of<IHttpContextAccessor>(),
                Mock.Of<IUserClaimsPrincipalFactory<AppUser>>(), null, null, null, null);

            //Моки для эмуляции авторизации пользователя в системе 
            var httpContextMock = new Mock<HttpContext>();
            var userPrincipalMock = new Mock<ClaimsPrincipal>();
            var identityMock = new Mock<ClaimsIdentity>();

            identityMock.Setup(i => i.Name).Returns("markmarkovich1@mail.ru");
            userPrincipalMock.Setup(p => p.Identity).Returns(identityMock.Object);

            httpContextMock.Setup(c => c.User).Returns(userPrincipalMock.Object);

            var controller = new AccountController(userManagerMock.Object, _tokenService, _context, signInManager.Object, _logger, _mapper);
            controller.ControllerContext = new ControllerContext()
            {
                HttpContext = httpContextMock.Object,
            };
            var result = await controller.AccountInfo();

            if (result is ActionResult<ProfileInfoDto> okResult)
            {
                var resultDto = okResult.Result;
                Assert.NotNull(resultDto);
            }
            result.Should().NotBeNull();
            result.Should().BeAssignableTo<ActionResult<ProfileInfoDto>>();
        }

    }
}