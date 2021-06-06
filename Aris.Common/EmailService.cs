using Aris.Common.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;
using System;
using System.Net;

namespace Aris.Common
{
    public class EmailService : IEmailService
    {
        private readonly AppSettings _appSettings;

        //public EmailService(IOptions<AppSettings> appSettings)
        //{
        //    _appSettings = appSettings.Value;
        //}
        public EmailService(AppSettings appSettings)
        {
            _appSettings = appSettings;
        }

        public async void  Send( string to,string cc, string subject, string html)
        {
            var email = new MimeMessage();

            string[] strToArrayTo = to.Split(',');
            foreach(var itemTo in strToArrayTo)
            {
                if(itemTo != string.Empty)
                {
                    email.To.Add(MailboxAddress.Parse(itemTo));
                }
            }
            string[] strToArray = cc.Split(',');
            foreach (var itemCc in strToArray)
            {
                if (itemCc != string.Empty)
                {
                    email.Cc.Add(MailboxAddress.Parse(itemCc));
                }
            }
            email.From.Add(MailboxAddress.Parse(_appSettings.SmtpUser));
            email.Subject = subject;
            email.Body = new TextPart(TextFormat.Html) { Text = html };
           
           
            //send mail
            using var smtp = new SmtpClient();
            smtp.Connect(_appSettings.SmtpHost, _appSettings.SmtpPort, true);
            smtp.Authenticate(_appSettings.SmtpUser, _appSettings.SmtpPassword);
           await smtp.SendAsync(email);
            smtp.Disconnect(true);

        }
    }
}
