using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Methodist_API.Migrations
{
    /// <inheritdoc />
    public partial class createRelationshipOwnerTypeAndFileEvents2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_result_events_owner_type_id",
                table: "result_events",
                column: "owner_type_id");

            migrationBuilder.AddForeignKey(
                name: "FK_result_events_result_owner_types_owner_type_id",
                table: "result_events",
                column: "owner_type_id",
                principalTable: "result_owner_types",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_result_events_result_owner_types_owner_type_id",
                table: "result_events");

            migrationBuilder.DropIndex(
                name: "IX_result_events_owner_type_id",
                table: "result_events");
        }
    }
}
