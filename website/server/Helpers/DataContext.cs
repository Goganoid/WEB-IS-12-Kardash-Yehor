using System.Security.Cryptography.Xml;
using Microsoft.EntityFrameworkCore;
using MyPlan.Entities;

namespace MyPlan.Helpers;

public class DataContext : DbContext
{
    protected readonly IConfiguration Configuration;

    public DataContext(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        // connect to sql server database
        options.UseSqlite(Configuration.GetConnectionString("ConnStr"));
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // configure many to many field Membership for User and Dashboard
        modelBuilder.Entity<Membership>().HasKey(x => new {x.MemberId, DashBoardId = x.DashboardId});
        modelBuilder.Entity<Membership>()
            .HasOne(x => x.Dashboard)
            .WithMany(x => x.Memberships)
            .HasForeignKey(x => x.DashboardId);
        modelBuilder.Entity<Membership>()
            .HasOne(x => x.Member)
            .WithMany(x => x.Memberships)
            .HasForeignKey(x => x.MemberId);
        // configure one to many for Dashboard and Tables
        modelBuilder.Entity<Dashboard>()
            .HasMany(x => x.Columns)
            .WithOne(x => x.Dashboard)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Column>()
            .HasMany(x => x.Cards)
            .WithOne(x => x.Column)
            .OnDelete(DeleteBehavior.Cascade);


    }

    public DbSet<User> Users { get; set; }
    public DbSet<Dashboard> Dashboards  { get; set; }
    public DbSet<Column> Columns  { get; set; }
    public DbSet<Membership> Memberships  { get; set; }
    public DbSet<Card> Cards  { get; set; }
}