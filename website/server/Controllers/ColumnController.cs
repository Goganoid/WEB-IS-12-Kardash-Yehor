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
using MyPlan.Models.Column;
using MyPlan.Repositories;
using MyPlan.Services;

namespace MyPlan.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class ColumnController : ControllerBase
{
    private IRepositoryManager _repositoryManager;
    private IColumnService _columnService;
    private IMapper _mapper;
    private readonly AppSettings _appSettings;
    private readonly IHubContext<DashboardHub,IDashboardClient> _hubContext;

    public ColumnController(
        IRepositoryManager repositoryManager,
        IColumnService columnService,
        IMapper mapper,
        IOptions<AppSettings> appSettings, IHubContext<DashboardHub, IDashboardClient> hubContext)
    {
        _columnService = columnService;
        _repositoryManager = repositoryManager;
        _mapper = mapper;
        _hubContext = hubContext;
        _appSettings = appSettings.Value;
    }

    [HttpPost("create/{dashboardId:int}")]
    public async Task<IActionResult> CreateColumn([FromBody] ColumnModel model, int dashboardId)
    {
        var column = _mapper.Map<Column>(model);
        var userId = int.Parse(HttpContext.User.Identity.Name);

        try
        {
            _columnService.CreateColumn(column, userId, dashboardId);
            var columnDTO = _mapper.Map<ColumnDTO>(column);
            await _hubContext.Clients.Group(dashboardId.ToString()).ReceiveMessage("add column");
            return Ok(columnDTO);
        }
        catch (AppException ex)
        {
            return BadRequest(ex.Message);
        }
        
    }
    [HttpPut("update/{columnId:int}")]
    public async Task<IActionResult> UpdateColumnInfo([FromBody] ColumnModel model,int columnId)
    {
        var column = _mapper.Map<Column>(model);
        var userId = int.Parse(HttpContext.User.Identity.Name);
        try
        {
            _columnService.UpdateColumn(column, userId, columnId);
            var dashboardId = _repositoryManager.Column.GetById(columnId).DashboardId;
            await _hubContext.Clients.Group(dashboardId.ToString()).ReceiveMessage("rename column");
            return Ok();
        }
        catch (AppException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("delete/{columnId:int}")]
    public async Task<IActionResult> DeleteColumn(int columnId)
    {
        var userId = int.Parse(HttpContext.User.Identity.Name);
        try
        {
            var dashboardId = _repositoryManager.Column.GetById(columnId)?.DashboardId;
            _columnService.DeleteColumn(columnId, userId);
           if(dashboardId!=null)
               await _hubContext.Clients.Group(dashboardId.ToString()).ReceiveMessage("add column");
            return Ok();
        }
        catch (AppException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}