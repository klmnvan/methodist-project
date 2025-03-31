using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Methodist_API.Migrations
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("c2e62fe8-19cc-4848-9a9f-b2f65cc78be5"));

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("d8214ca1-a658-447e-93c1-e23e59ea0fc0"));

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { new Guid("1386a204-ec83-468c-b29a-201b22c79f53"), null, "Teacher", "TEACHER" },
                    { new Guid("cb5032ec-1915-4957-a476-6a567d0dd308"), null, "Admin", "ADMIN" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("1386a204-ec83-468c-b29a-201b22c79f53"));

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("cb5032ec-1915-4957-a476-6a567d0dd308"));

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { new Guid("c2e62fe8-19cc-4848-9a9f-b2f65cc78be5"), null, "Admin", "ADMIN" },
                    { new Guid("d8214ca1-a658-447e-93c1-e23e59ea0fc0"), null, "Teacher", "TEACHER" }
                });
        }
    }
}
