using MyPlan.Entities;

namespace MyPlan.Models;


public class UserDTO
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
}
public class MembershipDTO
{
    public UserDTO Member { get; set; }
    public int MemberId { get; set; }
    public int DashboardId { get; set; }
    public RoleType MemberRole { get; set; }
}
public class ColumnDTO
{
    public int Id { get; set; }
    public int DashboardId { get; set; }
    public string Name { get; set; }
    public List<CardDTO> Cards { get; set; } = new();
}
public class CardDTO
{
    public int Id { get; set; }
    public string Content { get; set; }
    public double Position { get; set; }
    public int ColumnId { get; set; }
}