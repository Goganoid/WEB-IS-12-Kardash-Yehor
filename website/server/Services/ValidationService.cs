using MyPlan.Entities;
using MyPlan.Helpers;
using MyPlan.Repositories;

namespace MyPlan.Services;

public class ValidationService : IValidationService
{
    private IRepositoryManager _repositoryManager;
    public ValidationService(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }
    public void ValidateColumnModel(Column column)
    {
        if (string.IsNullOrWhiteSpace(column.Name)) throw new AppException("Incorrect column name");
    }

    public void ValidateCardModel(Card card,bool validateContent = true, bool validatePosition = false)
    {
        if (validateContent && string.IsNullOrWhiteSpace(card.Content)) throw new AppException("Incorrect card name");
        if (validatePosition)
        {
            if (card.Position == null || card.ColumnId == null)
            {
                throw new AppException("Position or ColumnId is null");
            }

            var column = _repositoryManager.Column.GetById(card.ColumnId);
            if (column==null)  throw new AppException("Column does not exist");
            var maxPosCard = column.Cards.MaxBy(x => x.Position);
            if (card.Position > (maxPosCard?.Position ?? 0)  + 2 || card.Position < 0)
                throw new AppException("Incorrect card Position");
        }
    }

    public void ValidateCardExists(int cardId)
    {
        if (!_repositoryManager.Card.Exists(cardId)) throw new AppException("Card does not exist");
    }
    public void ValidateDashboardAndOwner(int dashboardId, int userId)
    {
        
        if (!_repositoryManager.Dashboard.Exists(dashboardId))
            throw new AppException($"Dashboard with id={dashboardId} does not exist");
        var owner = _repositoryManager.Dashboard
            .GetMemberships(dashboardId)
            .Where(x => x.MemberRole == RoleType.Owner)
            .Select(x=>x.Member)
            .First();
        if (owner.Id != userId)
            throw new AppException($"User with id={userId} isn't the owner of this dashboard");
    }

    public void ValidateDashboardAndEditor(int dashboardId, int userId)
    {
        if (!_repositoryManager.Dashboard.Exists(dashboardId))
            throw new AppException($"Dashboard with id={dashboardId} does not exist");
        var editor = _repositoryManager.Dashboard
            .GetMemberships(dashboardId)
            .Where(x => x.MemberRole is RoleType.Owner or RoleType.Editor)
            .Select(x=>x.Member)
            .FirstOrDefault(x=>x.Id==userId);
        if (editor==null)
            throw new AppException($"User with id={userId} can't edit the dashboard");
    }

    public void ValidateDashboardAndHaveAccess(int dashboardId, int userId)
    {
        if (!_repositoryManager.Dashboard.Exists(dashboardId))
            throw new AppException($"Dashboard with id={dashboardId} does not exist");
        var user = _repositoryManager.Dashboard
            .GetMemberships(dashboardId)
            .Select(x=>x.Member)
            .FirstOrDefault(x => x.Id==userId);
        if (user==null)
            throw new AppException($"User with id={userId} doesn't have access to that dashboard");
    }

    public void ValidateDashboardModel(Dashboard dashboard)
    {
        if (string.IsNullOrWhiteSpace(dashboard.Name)) throw new AppException("Incorrect dashboard name");
    }

    public void ValidateDashboardExists(int dashboardId)
    {
        if (!_repositoryManager.Dashboard.Exists(dashboardId))
            throw new AppException($"Dashboard with id={dashboardId} does not exist");
    }

    public void ValidateUserExists(int userId)
    {
        if (!_repositoryManager.User.Exists(userId)) throw new AppException("User does not exist");
    }
    public void ValidateColumnExists(int columnId)
    {
        if (!_repositoryManager.Column.Exists(columnId)) throw new AppException("Column does not exist");
    }
}