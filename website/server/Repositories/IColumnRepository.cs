using MyPlan.Entities;

namespace MyPlan.Repositories;

public interface IColumnRepository : IRepositoryBase<Column>
{
    public Task<Column?> GetByIdAsync(int id);
    Column? GetById(int id);

    bool Exists(int id);

    IEnumerable<Card> GetCards(int id);
}