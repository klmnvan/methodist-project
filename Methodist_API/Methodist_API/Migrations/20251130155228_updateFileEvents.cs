using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Methodist_API.Migrations
{
    /// <inheritdoc />
    public partial class updateFileEvents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_file_events_events_event_id",
                table: "file_events");

            migrationBuilder.DropPrimaryKey(
                name: "PK_file_events",
                table: "file_events");

            migrationBuilder.RenameTable(
                name: "file_events",
                newName: "result_events");

            migrationBuilder.RenameIndex(
                name: "IX_file_events_event_id",
                table: "result_events",
                newName: "IX_result_events_event_id");

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "result_events",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "now()");

            migrationBuilder.AddColumn<string>(
                name: "owner_type",
                table: "result_events",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                table: "result_events",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "now()");

            migrationBuilder.AddPrimaryKey(
                name: "PK_result_events",
                table: "result_events",
                column: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_result_events_events_event_id",
                table: "result_events",
                column: "event_id",
                principalTable: "events",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_result_events_events_event_id",
                table: "result_events");

            migrationBuilder.DropPrimaryKey(
                name: "PK_result_events",
                table: "result_events");

            migrationBuilder.DropColumn(
                name: "created_at",
                table: "result_events");

            migrationBuilder.DropColumn(
                name: "owner_type",
                table: "result_events");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "result_events");

            migrationBuilder.RenameTable(
                name: "result_events",
                newName: "file_events");

            migrationBuilder.RenameIndex(
                name: "IX_result_events_event_id",
                table: "file_events",
                newName: "IX_file_events_event_id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_file_events",
                table: "file_events",
                column: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_file_events_events_event_id",
                table: "file_events",
                column: "event_id",
                principalTable: "events",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
