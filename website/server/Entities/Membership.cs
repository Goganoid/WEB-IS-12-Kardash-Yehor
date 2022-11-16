namespace MyPlan.Entities;

public class Membership
{
    public int MemberId { get; set; }
    public User Member { get; set; }
    public int DashboardId { get; set; }
    public Dashboard Dashboard { get; set; }
    public RoleType MemberRole { get; set; }
}