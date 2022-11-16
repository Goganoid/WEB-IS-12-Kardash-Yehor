using Microsoft.AspNetCore.DataProtection;

namespace MyPlan.Services;

public class SecretParameterService
{
    private readonly IDataProtector protector;  
    public SecretParameterService(IDataProtectionProvider dataProtectionProvider, IConfiguration config) {  
        protector = dataProtectionProvider.CreateProtector(config["UrlSecret"]);  
    }  
    public string Decode(string data) {  
        return protector.Protect(data);  
    }  
    public string Encode(string data) {  
        return protector.Unprotect(data);  
    }    
}