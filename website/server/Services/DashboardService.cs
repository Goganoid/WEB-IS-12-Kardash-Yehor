using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MyPlan.Entities;
using MyPlan.Helpers;
using MyPlan.Repositories;

namespace MyPlan.Services;

public class DashboardService: IDashboardService
{
    protected DataContext _context;
    private IRepositoryManager _repositoryManager;
    private IValidationService _validationService;
    private SecretParameterService _secretParameterService;

    public DashboardService(DataContext context, IRepositoryManager repositoryManager, IValidationService validationService, SecretParameterService secretParameterService)
    {
        _context = context;
        _repositoryManager = repositoryManager;
        _validationService = validationService;
        _secretParameterService = secretParameterService;
    }
    
    
    public Dashboard CreateDashboard(Dashboard dashboard_param, int userId)
    {
        _validationService.ValidateUserExists(userId);
        _validationService.ValidateDashboardModel(dashboard_param);
        
        _context.Add(dashboard_param);
        _context.SaveChanges();
        dashboard_param.Memberships.Add(new Membership()
        {
            DashboardId = dashboard_param.Id,
            MemberId = userId,
            MemberRole = RoleType.Owner
        });
        var default_column = new Column()
        {
            Name = "New Column",
            Cards = new List<Card>(){new Card(){Content = "Your first card"}}
        };
        dashboard_param.Columns.Add(default_column);
        _context.SaveChanges();
        return dashboard_param;
    }
    

    public void UpdateDashboard(Dashboard dashboard_param,int dashboardId, int userId)
    {
        _validationService.ValidateDashboardAndOwner(dashboardId, userId);
        _validationService.ValidateDashboardModel(dashboard_param);
        var dashboard = _repositoryManager.Dashboard.GetById(dashboardId);
        dashboard.Name = dashboard_param.Name;
        _repositoryManager.Dashboard.Update(dashboard);
        _repositoryManager.SaveChanges();
    }

    public void UpdateDashboardBackground(int dashboardId,int userId, string backgroundName)
    {
        _validationService.ValidateDashboardAndEditor(dashboardId, userId);
        var dashboard = _repositoryManager.Dashboard.GetById(dashboardId);
        dashboard.Background = backgroundName;
        _repositoryManager.Dashboard.Update(dashboard);
        _repositoryManager.SaveChanges();
    }

    public void DeleteDashboard(int dashboardId, int userId)
    {
        _validationService.ValidateDashboardAndOwner(dashboardId, userId);
        _repositoryManager.Dashboard.Delete(_repositoryManager.Dashboard.GetById(dashboardId)!);
        _repositoryManager.SaveChanges();
    }

    public List<Dashboard> GetUserDashboards(int userId)
    {
        _validationService.ValidateUserExists(userId);
        var user = _repositoryManager.User.GetById(userId);
        var dashboardIds = _repositoryManager.User.GetById(userId).Memberships.Select(membership => membership.DashboardId);
        var dashboards = new List<Dashboard>();
        foreach (var dashboardId in dashboardIds)
        {
            dashboards.Add(_repositoryManager.Dashboard.GetById(dashboardId));
        }
        return dashboards;
    }

    public string GetUrl(int dashboardId, int userId, RoleType role)
    {
        _validationService.ValidateDashboardAndHaveAccess(dashboardId,userId);
        var dashboard = _repositoryManager.Dashboard.GetAllInfo(dashboardId);
        switch (role)
        {
            case RoleType.Editor:
                dashboard.EditorUrl ??= _secretParameterService.Encode($"Editor/{dashboardId}");
                return dashboard.EditorUrl;
            case RoleType.Guest:
                dashboard.GuestUrl ??= _secretParameterService.Encode($"Guest/{dashboardId}");
                return dashboard.EditorUrl;
            case RoleType.Owner:
                throw new AppException("Can't generate url for Owner");
            default:
                throw new ArgumentOutOfRangeException(nameof(role), role, null);
        }
    }

    public void AddUserToDashboard(int dashboardId, int userId, RoleType role)
    {
        _validationService.ValidateDashboardExists(dashboardId);
        _validationService.ValidateUserExists(userId);
        var user = _repositoryManager.User.GetById(userId);
        if (user.Memberships.Exists(m => m.DashboardId == dashboardId))
            throw new AppException("User already has access to the dashboard");
        _repositoryManager.Dashboard.AddMembership(dashboardId,userId,role);
    }

    public void RemoveUserFromDashboard(int dashboardId, int userId, int userToRemoveId)
    {
        _validationService.ValidateDashboardAndOwner(dashboardId,userId);
        _repositoryManager.Dashboard.RemoveMembership(dashboardId, userToRemoveId);
    }

    public Dashboard GetDashboardFull(int dashboardId, int userId)
    {
        _validationService.ValidateDashboardAndHaveAccess(dashboardId,userId);
        var dashboard = _repositoryManager.Dashboard.GetAllInfo(dashboardId);
        return dashboard;
    }

    public User GetOwner(int dashboardId)
    {
        return _repositoryManager.Dashboard
            .GetMemberships(dashboardId)
            .Where(x => x.MemberRole == RoleType.Owner)
            .Select(x=>x.Member)
            .First();
    }
}