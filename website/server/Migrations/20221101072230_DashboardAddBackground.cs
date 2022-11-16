using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyPlan.Migrations
{
    public partial class DashboardAddBackground : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Backround",
                table: "Dashboards",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Backround",
                table: "Dashboards");
        }
    }
}
