using Microsoft.EntityFrameworkCore;
using MyPlan.Entities;
using MyPlan.Helpers;

namespace MyPlan.Repositories;

public interface ICardRepository : IRepositoryBase<Card>
{
    public Task<Card?> GetByIdAsync(int id);
    Card? GetById(int id);

    Card? GetByPosition(double position,int columnId);
    public void InsertAtPosition(Card otherCard,int sourceIndex, int destinationIndex, int columnId);
    public void SwapCardPositions(Card cardA, Card cardB);

    bool Exists(int id);

}
public class CardRepository : RepositoryBase<Card>, ICardRepository
{
    public CardRepository(DataContext context) : base(context)
    {
    }

    public async Task<Card?> GetByIdAsync(int id)
    {
        return await _context.Cards.FindAsync(id);
    }

    public Card? GetById(int id)
    {
        return _context.Cards.Include(x=>x.Column).FirstOrDefault(x=>x.Id==id);
    }

    public Card? GetByPosition(double position, int columnId)
    {
        return _context.Cards.FirstOrDefault(x=>Math.Abs(x.Position - position) < 0.001 && x.ColumnId==columnId);
    }
    
    
    public void InsertAtPosition(Card otherCard,int sourceIndex,int destinationIndex, int columnId)
    {

        var column = _context.Columns.Include(col=>col.Cards).First(col=>col.Id==columnId);
        var cards = column.Cards.OrderBy(x => x.Position).ToList();
        otherCard.ColumnId = columnId;
        if (destinationIndex == 0)
        {
            if (cards.Count > 0)
            {
                var nextCard = cards[0];
                otherCard.Position = nextCard.Position / 2.0;
            }
            else
            {
                otherCard.Position = 1;
            }
        }
        else if (destinationIndex >= cards.Count-1)
        {
            var maxPositionCard = column.Cards.MaxBy(x => x.Position);
            otherCard.Position = maxPositionCard.Position+1;
        }
        else
        {
            var prevCard = sourceIndex<destinationIndex ? cards[destinationIndex] : cards[destinationIndex-1];
            var nextCard = sourceIndex<destinationIndex ? cards[destinationIndex+1] : cards[destinationIndex];
            otherCard.Position = ( prevCard.Position + nextCard.Position) / 2.0;
        }

        _context.SaveChanges();
    }

    public void SwapCardPositions(Card cardA, Card cardB)
    {
        (cardA.Position, cardB.Position) = (cardB.Position, cardA.Position);

        _context.SaveChanges();
    }

    public bool Exists(int id)
    {
        return _context.Cards.Any(x => x.Id == id);
    }

}