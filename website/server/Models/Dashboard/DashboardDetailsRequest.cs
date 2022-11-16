using MyPlan.Entities;

namespace MyPlan.Models;

public class DashboardDetailsRequest
{
    public RoleType Role { get; set; }
    public int Id { get; set; }
    public string Name { get; set; }
    public string Background { get; set; }
    public List<MembershipDTO> Memberships { get; set; } = new();
    public List<ColumnDTO> Columns { get; set; } = new();
}