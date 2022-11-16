using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace MyPlan.Hubs;


public interface IDashboardClient
{
    Task ReceiveMessage(string message);
}
[Authorize]
public class DashboardHub: Hub<IDashboardClient>
{
    public override async Task OnConnectedAsync()
    {
        
        if (Context?.GetHttpContext()?.GetRouteValue("dashboardId") is string idString)
        {
            Console.WriteLine($"Connected dashboardId = {idString}" );
            bool parsed = int.TryParse(idString, out var dashboardId);
            if (parsed)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, idString);
            }
        }
        await base.OnConnectedAsync();
    }


    public async Task SendMessage()
    {
        await Clients.All.ReceiveMessage("test");
    }
}