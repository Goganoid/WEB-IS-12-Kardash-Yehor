using MyPlan.Entities;

namespace MyPlan.Services;

public interface IValidationService
{
    public void ValidateDashboardAndOwner(int dashboardId, int userId);
    public void ValidateDashboardAndEditor(int dashboardId, int userId);

    public void ValidateDashboardAndHaveAccess(int dashboardId, int userId);
    public void ValidateDashboardModel(Dashboard dashboard);
    public void ValidateDashboardExists(int dashboardId);
    public void ValidateUserExists(int userId);
    public void ValidateColumnModel(Column column);
    public void ValidateColumnExists(int tableId);
    public void ValidateCardModel(Card card, bool validateContent = true, bool validatePosition = false);
    public void ValidateCardExists(int cardId);

}