using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Methodist_API.Migrations
{
    /// <inheritdoc />
    public partial class addNewTypeEvent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "type_of_events",
                columns: new[] { "id", "name" },
                values: new object[] { new Guid("53ffe6e1-f95d-4b8a-9922-36c6c2840498"), "Участие студентов" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "type_of_events",
                keyColumn: "id",
                keyValue: new Guid("53ffe6e1-f95d-4b8a-9922-36c6c2840498"));
        }
    }
}
