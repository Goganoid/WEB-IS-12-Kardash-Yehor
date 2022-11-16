using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using MyPlan.Helpers;

namespace MyPlan.Repositories;

public class RepositoryBase<T> : IRepositoryBase<T> where T : class
{
    protected DataContext _context;
    public RepositoryBase(DataContext context)
    {
        _context = context;
    }

    public IQueryable<T> FindAll() => 
        _context.Set<T>().AsNoTracking();

    public IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression) => 
        _context.Set<T>().Where(expression);
    
    public void Create(T entity) => _context.Set<T>().Add(entity);

    public void Update(T entity) => _context.Set<T>().Update(entity);

    public void Delete(T entity) => _context.Set<T>().Remove(entity);
}