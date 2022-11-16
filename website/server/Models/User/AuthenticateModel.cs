using System.ComponentModel.DataAnnotations;

namespace MyPlan.Models.User;

public class AuthenticateModel
{
    [Required]
    public string Email { get; set; }

    [Required]
    public string Password { get; set; }
}