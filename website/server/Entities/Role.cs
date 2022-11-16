namespace MyPlan.Entities;


public enum RoleType
{
    Owner,
    Editor,
    Guest,
}

public class Role
{
    public int UserId { get; set; }
    public RoleType RoleType { get; set; }
}