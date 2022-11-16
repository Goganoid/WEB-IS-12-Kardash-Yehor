using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyPlan.Migrations
{
    public partial class DashboardAddBackgroundUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Backround",
                table: "Dashboards",
                newName: "Background");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Background",
                table: "Dashboards",
                newName: "Backround");
        }
    }
}
