
namespace MyPlan.Entities;

public class Dashboard
{
    public int Id { get; set; }
    public string Name { get; set; }

    public string Background { get; set; } = "background1.jpg";
    public List<Membership> Memberships { get; set; } = new();
    public List<Column> Columns { get; set; } = new();
    
    public string? EditorUrl { get; set; }
    public string? GuestUrl { get; set; }
}