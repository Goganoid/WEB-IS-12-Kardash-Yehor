using MyPlan.Entities;

namespace MyPlan.Repositories;

public interface IUserRepository: IRepositoryBase<User>
{
    User Authenticate(string username, string password);
    IEnumerable<User> GetAll();

    public Task<IEnumerable<User>> GetAllAsync();
    public Task<User> GetByIdAsync(int userId);
    User GetById(int id);
    
    bool Exists(int id);
    User Create(User user, string password);
    void Update(User user, string password = null);
    void Delete(int id);
}