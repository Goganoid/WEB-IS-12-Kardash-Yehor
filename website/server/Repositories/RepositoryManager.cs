using MyPlan.Helpers;

namespace MyPlan.Repositories;

public interface IRepositoryManager
{
    IUserRepository User { get; }
    IDashboardRepository Dashboard { get; }
    IColumnRepository Column { get; }
    ICardRepository Card { get; }
    void SaveChangesAsync();
    void SaveChanges();
}

public class RepositoryManager: IRepositoryManager
{
    private DataContext _dataContext;
    private IUserRepository _userRepository;
    private IDashboardRepository _dashboardRepository;
    private IColumnRepository _columnRepository;
    private ICardRepository _cardRepository;

    public RepositoryManager(DataContext dataContext) 
    {
        _dataContext = dataContext;
    }
    public IUserRepository User
    {
        get
        {
            if(_userRepository== null)
                _userRepository= new UserRepository(_dataContext );
            return _userRepository;
        }
    }
    public IDashboardRepository Dashboard
    {
        get
        {
            if(_dashboardRepository== null)
                _dashboardRepository= new DashboardRepository(_dataContext );
            return _dashboardRepository;
        }
    }
    public IColumnRepository Column
    {
        get
        {
            if(_columnRepository== null)
                _columnRepository= new ColumnRepository(_dataContext );
            return _columnRepository;
        }
    }
    public ICardRepository Card
    {
        get
        {
            if(_cardRepository== null)
                _cardRepository= new CardRepository(_dataContext );
            return _cardRepository;
        }
    }
    public void SaveChanges() => _dataContext.SaveChanges();
    public async void SaveChangesAsync() => await _dataContext.SaveChangesAsync();
}
