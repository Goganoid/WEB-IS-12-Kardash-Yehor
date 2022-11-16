using Microsoft.EntityFrameworkCore;
using MyPlan.Entities;
using MyPlan.Helpers;
using MyPlan.Services;

namespace MyPlan.Repositories;

public class ColumnRepository : RepositoryBase<Column>, IColumnRepository
{
    public ColumnRepository(DataContext context) : base(context)
    {
    }

    public async Task<Column?> GetByIdAsync(int id)
    {
        return await _context.Columns.FindAsync(id);
    }

    public Column? GetById(int id)
    {
        return _context.Columns
            .Include(x=>x.Dashboard)
            .Include(x=>x.Cards)
            .FirstOrDefault(x=>x.Id==id);
    }

    public bool Exists(int id)
    {
        return _context.Columns.Any(x => x.Id == id);
    }

    public IEnumerable<Card> GetCards(int id)
    {
        var column = _context.Columns.Include(x => x.Cards).FirstOrDefault(x => x.Id == id);
        if (column == null) throw new AppException("Can't get cards because can't find column");
        return column.Cards;
    }
}