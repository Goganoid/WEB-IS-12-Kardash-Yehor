using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MyPlan.Entities;
using MyPlan.Helpers;
using MyPlan.Models;
using MyPlan.Models.User;
using MyPlan.Repositories;


namespace MyPlan.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    private IRepositoryManager _repositoryManager;
    private IMapper _mapper;
    private readonly AppSettings _appSettings;

    public UsersController(
        IRepositoryManager repositoryManager,
        IMapper mapper,
        IOptions<AppSettings> appSettings)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
        _appSettings = appSettings.Value;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public IActionResult Authenticate([FromBody]AuthenticateModel model)
    {
        var user = _repositoryManager.User.Authenticate(model.Email, model.Password);

        if (user == null)
            return BadRequest(new { message = "Username or password is incorrect" });

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, user.Id.ToString())
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        // return basic user info and authentication token
        return Ok(new
        {
            user.Id,
            Username = user.Email,
            user.FirstName,
            user.LastName,
            Token = tokenString
        });
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public IActionResult Register([FromBody]RegisterModel model)
    {
        // map model to entity
        var userModel = _mapper.Map<User>(model);

        try
        {
            // create user
            var user = _repositoryManager.User.Create(userModel, model.Password);
            return Ok();
        }
        catch (AppException ex)
        {
            // return error message if there was an exception
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var users = _repositoryManager.User.GetAll();
        var model = _mapper.Map<IList<UserModel>>(users);
        return Ok(model);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var user = _repositoryManager.User.GetById(id);
        var model = _mapper.Map<UserModel>(user);
        return Ok(model);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody]UpdateModel model)
    {
        // map model to entity and set id
        var user = _mapper.Map<User>(model);
        user.Id = id;

        try
        {
            // update user 
            _repositoryManager.User.Update(user, model.Password);
            return Ok();
        }
        catch (AppException ex)
        {
            // return error message if there was an exception
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _repositoryManager.User.Delete(id);
        return Ok();
    }
}