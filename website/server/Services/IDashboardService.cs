using MyPlan.Entities;
using NuGet.Packaging.Signing;

namespace MyPlan.Services;

public interface IDashboardService
{
    public Dashboard CreateDashboard(Dashboard dashboard_param, int userId);
    public void UpdateDashboard(Dashboard dashboard,int dashboardId, int userId);
    public void UpdateDashboardBackground(int dashboardId,int userId, string backgroundName);
    public void DeleteDashboard(int dashboardId, int userId);
    public List<Dashboard> GetUserDashboards(int userId);

    public string GetUrl(int dashboardId, int userId, RoleType role);
    public void AddUserToDashboard(int dashboardId, int userId, RoleType role);
    public void RemoveUserFromDashboard(int dashboardId, int userId, int userToRemoveId);
    public Dashboard GetDashboardFull(int dashboardId,int userId);
    public User GetOwner(int dashboardId);
}