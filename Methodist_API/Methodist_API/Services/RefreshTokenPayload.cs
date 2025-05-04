namespace Methodist_API.Services
{
    class RefreshTokenPayload
    {
        public Guid UserId { get; set; }
        public Guid TokenId { get; set; }
        public long Expires { get; set; }
        public string Salt { get; set; }
    }

}
