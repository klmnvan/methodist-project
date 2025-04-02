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
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: true),
                    SecurityStamp = table.Column<string>(type: "text", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "type_of_events",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_type_of_events", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "UserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "text", nullable: false),
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    DeviceId = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTokens", x => new { x.UserId, x.LoginProvider, x.Name, x.DeviceId });
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    RoleId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "events",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    date_of_event = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    end_date_of_event = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    type_id = table.Column<Guid>(type: "uuid", nullable: false),
                    is_checked = table.Column<bool>(type: "boolean", nullable: false),
                    is_approoved = table.Column<bool>(type: "boolean", nullable: false),
                    type = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    form_of_participation = table.Column<string>(type: "text", nullable: false),
                    form_of_event = table.Column<string>(type: "text", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false),
                    location = table.Column<string>(type: "text", nullable: false),
                    quantity_of_hours = table.Column<string>(type: "text", nullable: false),
                    result = table.Column<string>(type: "text", nullable: false),
                    profile_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_events", x => x.id);
                    table.ForeignKey(
                        name: "FK_events_type_of_events_type_id",
                        column: x => x.type_id,
                        principalTable: "type_of_events",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "file_events",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    event_id = table.Column<Guid>(type: "uuid", nullable: false),
                    file_name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_file_events", x => x.id);
                    table.ForeignKey(
                        name: "FK_file_events_events_event_id",
                        column: x => x.event_id,
                        principalTable: "events",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "methodical_committees",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    name = table.Column<string>(type: "text", nullable: false),
                    head_id = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_methodical_committees", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "profiles",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    first_name = table.Column<string>(type: "text", nullable: false),
                    last_name = table.Column<string>(type: "text", nullable: false),
                    patronymic = table.Column<string>(type: "text", nullable: false),
                    MC_id = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_profiles", x => x.id);
                    table.ForeignKey(
                        name: "FK_profiles_AspNetUsers_id",
                        column: x => x.id,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_profiles_methodical_committees_MC_id",
                        column: x => x.MC_id,
                        principalTable: "methodical_committees",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { new Guid("c9eb182b-1c3e-4c3b-8c3e-1c3e4c3b8c3e"), "c9eb182b-1c3e-4c3b-8c3e-1c3e4c3b8c3e", "Teacher", "TEACHER" },
                    { new Guid("f47ac10b-58cc-4372-a567-0e02b2c3d479"), "f47ac10b-58cc-4372-a567-0e02b2c3d479", "Admin", "ADMIN" }
                });

            migrationBuilder.InsertData(
                table: "methodical_committees",
                columns: new[] { "id", "head_id", "name" },
                values: new object[,]
                {
                    { new Guid("12b926c0-2e39-4d06-a588-1f8f018622a9"), null, "Гуманитарных дисциплин" },
                    { new Guid("49dcb840-1885-4a19-87d6-8c0fa80fede7"), null, "Иностранного языка" },
                    { new Guid("4e3f28ce-029a-40d5-a02a-765d72f35bfe"), null, "Музыкальных дисциплин" },
                    { new Guid("52c00ef1-4a3d-4995-a842-eb525fe82aef"), null, "Математических и естественно - научных дисциплин" },
                    { new Guid("574378fc-b335-4466-84ab-b15441e3b3bb"), null, "Специальности Дошкольное образование" },
                    { new Guid("5d22e938-b4fc-4044-be1b-00bc654becdb"), null, "Специальностей Товароведение, Коммерция" },
                    { new Guid("67f33b56-53ba-4609-9423-ca5565996262"), null, "Специальности Преподавание в начальных классах" },
                    { new Guid("707b476f-0905-41ba-8dea-f32fea287448"), null, "Специальностей Банковское дело, ДОУ" },
                    { new Guid("97c70cce-7639-4154-b84d-8cc94593820b"), null, "Экономика и управление, логистика" },
                    { new Guid("c2d0d4dc-35ce-4d37-b0ec-462eae895980"), null, "Инструментальных дисциплин" },
                    { new Guid("cc476f29-7419-4254-aa5c-7d869a21bbe9"), null, "Дисциплин физической культуры и БЖД" },
                    { new Guid("d793c1bb-9082-4367-8789-53ff550057cc"), null, "Информатика и вычислительная техника" },
                    { new Guid("f778fac4-7fff-4f7b-a8a1-49a07640acab"), null, "Общественных и правовых дисциплин" }
                });

            migrationBuilder.InsertData(
                table: "type_of_events",
                columns: new[] { "id", "name" },
                values: new object[,]
                {
                    { new Guid("01f2e985-5066-4a1c-bc51-5c46b6b20362"), "Стажировка" },
                    { new Guid("5ce9f584-6fea-41e9-9a64-4ab4d9d09e84"), "Публикация" },
                    { new Guid("638ea3fe-b998-4a6e-a06e-3331597e34b8"), "Участие" },
                    { new Guid("ec2d1d7b-4cb7-41e1-aa80-74f695fea627"), "Проведение" }
                });

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_events_profile_id",
                table: "events",
                column: "profile_id");

            migrationBuilder.CreateIndex(
                name: "IX_events_type_id",
                table: "events",
                column: "type_id");

            migrationBuilder.CreateIndex(
                name: "IX_file_events_event_id",
                table: "file_events",
                column: "event_id");

            migrationBuilder.CreateIndex(
                name: "IX_methodical_committees_head_id",
                table: "methodical_committees",
                column: "head_id");

            migrationBuilder.CreateIndex(
                name: "IX_profiles_MC_id",
                table: "profiles",
                column: "MC_id");

            migrationBuilder.AddForeignKey(
                name: "FK_events_profiles_profile_id",
                table: "events",
                column: "profile_id",
                principalTable: "profiles",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_methodical_committees_profiles_head_id",
                table: "methodical_committees",
                column: "head_id",
                principalTable: "profiles",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_profiles_AspNetUsers_id",
                table: "profiles");

            migrationBuilder.DropForeignKey(
                name: "FK_methodical_committees_profiles_head_id",
                table: "methodical_committees");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "file_events");

            migrationBuilder.DropTable(
                name: "UserTokens");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "events");

            migrationBuilder.DropTable(
                name: "type_of_events");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "profiles");

            migrationBuilder.DropTable(
                name: "methodical_committees");
        }
    }
}
