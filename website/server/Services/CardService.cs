using MyPlan.Entities;
using MyPlan.Helpers;
using MyPlan.Models.Card;
using MyPlan.Repositories;

namespace MyPlan.Services;


public interface ICardService
{
    public Card CreateCard(Card cardParam,int columnId ,int userId);
    public void UpdateCardContent(Card cardParam, int cardId, int userId);
    public void UpdateCardPosition(CardPositionModel cardNewPosition, int cardId, int userId);
    public void DeleteCard(int cardId, int userId);
}

public class CardService: ICardService
{
    protected DataContext _context;
    private IRepositoryManager _repositoryManager;
    private IValidationService _validationService;
    
    public CardService(DataContext context, IRepositoryManager repositoryManager, IValidationService validationService)
    {
        _context = context;
        _repositoryManager = repositoryManager;
        _validationService = validationService;
    }
    
    public Card CreateCard(Card cardParam,int columnId, int userId)
    {
       _validationService.ValidateUserExists(userId);
       _validationService.ValidateColumnExists(columnId);
       var column = _repositoryManager.Column.GetById(columnId);
       var dashboardId = column.DashboardId;
       _validationService.ValidateDashboardAndEditor(dashboardId,userId);
       _validationService.ValidateCardModel(cardParam);
       cardParam.ColumnId = column.Id;
       var maxPositionCard = _repositoryManager.Column.GetCards(column.Id).MaxBy(x => x.Position);
       var maxPosition = maxPositionCard == null ? 1 : maxPositionCard.Position + 1;
       cardParam.Position = maxPosition;
       _context.Add(cardParam);
       _context.SaveChanges();
       return cardParam;
    }

    public void UpdateCardContent(Card cardParam,int cardId,int userId)
    {
        ValidateAllExistsAndRights(userId,cardId);
        var card = _repositoryManager.Card.GetById(cardId);
        _validationService.ValidateCardModel(cardParam);
         
        card.Content = cardParam.Content;
        _repositoryManager.Card.Update(card);
        _repositoryManager.SaveChanges();
    }
    public void UpdateCardPosition(CardPositionModel cardNewPosition,int cardId,int userId)
    {
        ValidateAllExistsAndRights(userId,cardId);
        var card = _repositoryManager.Card.GetById(cardId);
        _repositoryManager.Card.InsertAtPosition(card,cardNewPosition.SourceIndex,cardNewPosition.DestinationIndex,cardNewPosition.ColumnId);
        _repositoryManager.SaveChanges();
    }
    
    
    public void DeleteCard(int cardId, int userId)
    {
        _validationService.ValidateCardExists(cardId);
        var card = _repositoryManager.Card.GetById(cardId);
        var dashboardId = _repositoryManager.Column.GetById(card.ColumnId).DashboardId;
        _validationService.ValidateDashboardAndEditor(dashboardId, userId);
        
        _repositoryManager.Card.Delete(card);
        _repositoryManager.SaveChanges();
    }

    private void ValidateAllExistsAndRights(int userId,int cardId)
    {
        _validationService.ValidateUserExists(userId);
        _validationService.ValidateCardExists(cardId);
        var card = _repositoryManager.Card.GetById(cardId);
        _validationService.ValidateColumnExists(card.ColumnId);
        var column = _repositoryManager.Column.GetById(card.ColumnId);
        var dashboardId = column.DashboardId;
        _validationService.ValidateDashboardAndEditor(dashboardId,userId);
    }
}