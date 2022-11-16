using MyPlan.Entities;
using MyPlan.Helpers;
using MyPlan.Repositories;

namespace MyPlan.Services;


public interface IColumnService
{
    public void CreateColumn(Column columnParam, int userId, int dashboardId);
    
    public void UpdateColumn(Column columnParam,int userId,int columnId);
    public void DeleteColumn(int columnId, int userId);
}

public class ColumnService: IColumnService
{
    protected DataContext _context;
    private IRepositoryManager _repositoryManager;
    private IValidationService _validationService;
    
    public ColumnService(DataContext context, IRepositoryManager repositoryManager, IValidationService validationService)
    {
        _context = context;
        _repositoryManager = repositoryManager;
        _validationService = validationService;
    }
    
    public void CreateColumn(Column columnParam,int userId,int dashboardId)
    {
       _validationService.ValidateUserExists(userId);
       _validationService.ValidateDashboardAndEditor(dashboardId,userId);
       _validationService.ValidateColumnModel(columnParam);
       columnParam.Dashboard = _repositoryManager.Dashboard.GetById(dashboardId);
       _context.Add(columnParam);
       _context.SaveChanges();
    }

    public void UpdateColumn(Column columnParam,int userId,int columnId)
    {
        _validationService.ValidateColumnExists(columnId);
        var table = _repositoryManager.Column.GetById(columnId);
        var dashboardId = table.Dashboard.Id;
        _validationService.ValidateDashboardAndEditor(dashboardId, userId);
        _validationService.ValidateColumnModel(columnParam);
        table.Name = columnParam.Name;
        _repositoryManager.Column.Update(table);
        _repositoryManager.SaveChanges();
    }

    public void DeleteColumn(int columnId, int userId)
    {
        _validationService.ValidateColumnExists(columnId);
        var table = _repositoryManager.Column.GetById(columnId);
        var dashboardId = table.Dashboard.Id;
        _validationService.ValidateDashboardAndEditor(dashboardId, userId);
        
        _repositoryManager.Column.Delete(table);
        _repositoryManager.SaveChanges();
    }
}