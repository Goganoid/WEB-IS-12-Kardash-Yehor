using Microsoft.EntityFrameworkCore;
using MyPlan.Entities;
using MyPlan.Helpers;
using MyPlan.Services;

namespace MyPlan.Repositories;

public class DashboardRepository: RepositoryBase<Dashboard>, IDashboardRepository
{
    public DashboardRepository(DataContext context) : base(context)
    {
    }

    public async Task<Dashboard?> GetByIdAsync(int id)
    {
        return await _context.Dashboards.FindAsync(id);
    }

    public Dashboard? GetById(int id)
    {
        return _context.Dashboards.Find(id);
    }

    public Dashboard? GetAllInfo(int id)
    {
        return _context.Dashboards
            .Include(x => x.Memberships)
                .ThenInclude(x=>x.Member)
            .Include(x=>x.Columns)
                .ThenInclude(x=>x.Cards)
            .FirstOrDefault(x=>x.Id==id);
        
    }

    public bool Exists(int id)
    {
        return _context.Dashboards.Any(x => x.Id == id);
    }

    
    public void AddMembership(int dashboardId, int userId, RoleType role)
    {
        var dashboard = _context.Dashboards
            .Include(d => d.Memberships)
            .First(d=>d.Id==dashboardId);
        // user already has membership 
        if(dashboard.Memberships.Exists(m=>m.MemberId==userId)) return;
        dashboard.Memberships.Add(
            new Membership()
            {
                DashboardId = dashboardId,
                MemberId = userId,
                MemberRole = role
            });
        _context.SaveChanges();
    }

    public void RemoveMembership(int dashboardId, int memberId)
    {
        var dashboard = _context.Dashboards.Include(x => x.Memberships).FirstOrDefault(x=>x.Id==dashboardId);
        var membership = dashboard.Memberships.FirstOrDefault(x=>x.MemberId==memberId);
        if (membership.MemberRole == RoleType.Owner) throw new AppException("Can't remove owner");
        if (membership != null)
        {
            dashboard.Memberships.Remove(membership);
        }

        _context.SaveChanges();
    }
    public IEnumerable<Membership> GetMemberships(int id)
    {
        return _context.Memberships.Include(x=>x.Member)
            .Where(x => x.DashboardId == id)
            .ToList();
    }
}