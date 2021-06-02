namespace Aris.Common
{
    public class AppSettings
    {
        public string SmtpHost { get; internal set; }
        internal int SmtpPort { get; set; }
        public string SmtpUser { get; internal set; }
        public string SmtpPassword { get; internal set; }
    }
}