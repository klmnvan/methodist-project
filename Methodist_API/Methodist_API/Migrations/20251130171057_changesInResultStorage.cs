using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Methodist_API.Migrations
{
    /// <inheritdoc />
    public partial class changesInResultStorage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "result",
                table: "events");

            migrationBuilder.AlterColumn<string>(
                name: "file_name",
                table: "result_events",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "result",
                table: "result_events",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "result",
                table: "result_events");

            migrationBuilder.AlterColumn<string>(
                name: "file_name",
                table: "result_events",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "result",
                table: "events",
                type: "text",
                nullable: true);
        }
    }
}
