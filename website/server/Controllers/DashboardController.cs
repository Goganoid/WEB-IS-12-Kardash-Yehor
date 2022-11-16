using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using MyPlan.Entities;
using MyPlan.Helpers;
using MyPlan.Hubs;
using MyPlan.Models;
using MyPlan.Models.Dashboard;
using MyPlan.Models.User;
using MyPlan.Repositories;
using MyPlan.Services;

namespace MyPlan.Controllers;


[ApiController]
[Route("[controller]")]
public class DashboardController : ControllerBase
{
    private IRepositoryManager _repositoryManager;
    private IDashboardService _dashboardService;
    private IMapper _mapper;
    private readonly AppSettings _appSettings;
    private SecretParameterService _secretParameterService;
    private readonly IHubContext<DashboardHub,IDashboardClient> _hubContext;
    public DashboardController(
        IRepositoryManager repositoryManager,
        IDashboardService dashboardService,
        IMapper mapper,
        IOptions<AppSettings> appSettings, SecretParameterService secretParameterService, IHubContext<DashboardHub,IDashboardClient> hubContext)
    {
        _dashboardService = dashboardService;
        _repositoryManager = repositoryManager;
        _mapper = mapper;
        _secretParameterService = secretParameterService;
        _hubContext = hubContext;
        _appSettings = appSettings.Value;
    }
    [Authorize]
    [HttpGet("get/{dashboardId:int}")]
    public IActionResult GetDashboard(int dashboardId)
    {
        var userId = int.Parse(HttpContext.User.Identity.Name);

        try
        {
            var dashboard = _dashboardService.GetDashboardFull(dashboardId, userId);
            var dashboardDTO = _mapper.Map<DashboardDetailsRequest>(dashboard);
            foreach (var column in dashboardDTO.Columns)
            {
                column.Cards = column.Cards.OrderBy(card => card.Position).ToList();
            }

            dashboardDTO.Role = dashboard.Memberships.First(x => x.MemberId == userId).MemberRole;
            return Ok(dashboardDTO);
        }
        catch (AppException ex)
        {
            return BadRequest(ex.Message);
        }
    }
    
    [Authorize]
    [HttpGet("get/{dashboardId:int}/{roleType}/url/")]
    public IActionResult GetEditorUrl(int dashboardId,string roleType)
    {
        var userId = int.Parse(HttpContext.User.Identity.Name);
        try
        {
            RoleType? role = roleType switch
            {
                "editor" => RoleType.Editor,
                "guest" => RoleType.Guest,
                _ => null
            };
            if (role == null) return BadRequest("Incorrect url");
            _dashboardService.GetUrl(dashboardId, userId, (RoleType) role);
            return Ok();
        }
        catch (AppException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpPost("join/{dashboardId:int}/")]
    public IActionResult Join([FromBody] JoinModel model,int dashboardId)
    {
        var role = (RoleType) model.Role;
        if (model.Email.Length == 0 || role == RoleType.Owner)
        {
            return BadRequest("Wrong data");
        }
        User? user = _repositoryManager.User.FindByCondition(u => u.Email == model.Email).FirstOrDefault();
        if (user == null) return NotFound("User by email not found"); 
        try
        {
           _dashboardService.AddUserToDashboard(dashboardId,user.Id,role);
           var newMemberships = _repositoryManager.Dashboard
               .GetMemberships(dashboardId)
               .Select(m=>_mapper.Map<MembershipDTO>(m));
            return Ok(newMemberships);
        }
        catch (AppException ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [Authorize]
    [HttpDelete("{dashboardId:int}/removeUser/{userToRemoveId:int}")]
    public IActionResult RemoveUser(int dashboardId,int userToRemoveId)
    {
        var userId = int.Parse(HttpContext.User.Identity.Name);
        try
        {
            _dashboardService.RemoveUserFromDashboard(dashboardId,userId,userToRemoveId);
            var newMemberships = _repositoryManager.Dashboard
                .GetMemberships(dashboardId)
                .Select(m=>_mapper.Map<MembershipDTO>(m));
            return Ok(newMemberships);
        }
        catch (AppException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("get/user/{userId:int}")]
    public IActionResult GetDashboards(int userId)
    {
        try
        {
            var dashboards = _dashboardService.GetUserDashboards(userId);
            var dashboardDTOs = dashboards.Select(dashboard=>_mapper.Map<DashboardInfoRequest>(dashboard));
            return Ok(dashboardDTOs);
        }
        catch (AppException ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [Authorize]
    [HttpPost("create")]
    public IActionResult CreateDashboard([FromBody] DashboardModel model)
    {
        var dashboard = _mapper.Map<Dashboard>(model);
        var userId = int.Parse(HttpContext.User.Identity.Name);

        try
        {
            var newDashboard = _dashboardService.CreateDashboard(dashboard, userId);
            var newDashboardDTO = _mapper.Map<DashboardInfoRequest>(newDashboard);
            return Ok(newDashboardDTO);
        }
        catch (AppException ex)
        {
            return BadRequest(ex.Message);
        }
        
    }
    [Authorize]
    [HttpPut("update/{dashboardId:int}")]
    public async Task<IActionResult> UpdateDashboardInfo([FromBody] DashboardModel model,int dashboardId)
    {
        var dashboard = _mapper.Map<Dashboard>(model);
        var userId = int.Parse(HttpContext.User.Identity.Name);
        try
        {
            _dashboardService.UpdateDashboard(dashboard, dashboardId, userId);
            await _hubContext.Clients.Group(dashboardId.ToString()).ReceiveMessage("change dashboard name");
            return Ok();
        }
        catch (AppException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpPut("update/{dashboardId:int}/background/{backgroundName}")]
    public async Task<IActionResult> UpdateDashboardBackground(int dashboardId, string backgroundName)
    {
        var userId = int.Parse(HttpContext.User.Identity.Name);
        try
        {
            _dashboardService.UpdateDashboardBackground(dashboardId, userId,backgroundName);
            await _hubContext.Clients.Group(dashboardId.ToString()).ReceiveMessage("change background");
            return Ok();
        }
        catch (AppException ex)
        {
            return BadRequest(ex.Message);
        }
    }
    
    
    [Authorize]
    [HttpDelete("delete/{dashboard_id:int}")]
    public IActionResult DeleteDashboard(int dashboard_id)
    {
        var userId = int.Parse(HttpContext.User.Identity.Name);
        try
        {
            _dashboardService.DeleteDashboard(dashboard_id, userId);
            return Ok();
        }
        catch (AppException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}