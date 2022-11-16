namespace MyPlan.Entities;

public class Column
{
    public int Id { get; set; }
    public int DashboardId { get; set; }
    public Dashboard Dashboard { get; set; }
    public string Name { get; set; }
    public List<Card> Cards { get; set; } = new();
}