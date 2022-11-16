using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyPlan.Migrations
{
    public partial class DashboardAddUrl : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EditorUrl",
                table: "Dashboards",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GuestUrl",
                table: "Dashboards",
                type: "TEXT",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EditorUrl",
                table: "Dashboards");

            migrationBuilder.DropColumn(
                name: "GuestUrl",
                table: "Dashboards");
        }
    }
}
