using MyPlan.Entities;

namespace MyPlan.Repositories;

public interface IDashboardRepository: IRepositoryBase<Dashboard>
{
    public Task<Dashboard?> GetByIdAsync(int id);
    Dashboard? GetById(int id);

    Dashboard? GetAllInfo(int id);

    bool Exists(int id);

    void AddMembership(int dashboardId, int userId, RoleType role);
    public void RemoveMembership(int dashboardId, int memberId);

    public IEnumerable<Membership> GetMemberships(int id);
}