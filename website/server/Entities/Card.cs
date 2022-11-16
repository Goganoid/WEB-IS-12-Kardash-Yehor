namespace MyPlan.Entities;

public class Card
{
    public int Id { get; set; }
    public string Content { get; set; }
    public double Position { get; set; }
    
    public int ColumnId { get; set; }
    public Column Column { get; set; }
}
