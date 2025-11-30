using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Methodist_API.Migrations
{
    /// <inheritdoc />
    public partial class createOwnerTypesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "owner_type",
                table: "result_events");

            migrationBuilder.AddColumn<Guid>(
                name: "owner_type_id",
                table: "result_events",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "result_owner_types",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_result_owner_types", x => x.id);
                });

            migrationBuilder.InsertData(
                table: "result_owner_types",
                columns: new[] { "id", "name" },
                values: new object[,]
                {
                    { new Guid("8fe1805f-93a1-42f5-98b4-fc4a7687eb59"), "Студент" },
                    { new Guid("c1481f78-bee6-4dfc-8682-cc08d937711e"), "Преподаватель" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "result_owner_types");

            migrationBuilder.DropColumn(
                name: "owner_type_id",
                table: "result_events");

            migrationBuilder.AddColumn<string>(
                name: "owner_type",
                table: "result_events",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
