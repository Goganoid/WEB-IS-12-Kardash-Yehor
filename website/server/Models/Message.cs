using Microsoft.AspNetCore.Http;

namespace MyPlan.Models;

public record Message(string Text, int StatusCode);