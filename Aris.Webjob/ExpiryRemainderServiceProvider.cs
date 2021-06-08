using Aris.Common;
using Aris.Common.Interfaces;
using Aris.Data;
using Aris.Models;
using Aris.Models.Helper;
using Aris.Models.ViewModel;
using Hangfire;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Aris.Webjob
{
    public class ExpiryRemainderServiceProvider : IExpiryRemainderServiceProvider
    {
        private readonly IEmailService emailService;
        public ExpiryRemainderServiceProvider(IEmailService emailService)
        {
            this.emailService = emailService;
        }
        public static readonly string remainderJob = "RemainderJob";

        UnitOfWork UnitOfWork = new UnitOfWork();
        private string strManagerNames;
        private string strManagerMails;

        public void RemainderWorker(IJobCancellationToken jobCancellationToken)
        {
            RecurringJob.AddOrUpdate(remainderJob, () => MailRemainder(),
                Cron.Daily);
        }

        public void MailRemainder()
        {
            AppSettings appsettings = new AppSettings
            {
                SmtpHost = "mail.aris.com.om",
                SmtpPassword = "Notifications2021",
                SmtpPort = 465,
                SmtpUser = "amtnotification@aris.com.om"
            };
            EmailService emailService = new EmailService(appsettings);
            OfficeDocumentExpiryRemainderJob(emailService);

            //var employeeDocumentDetails = UnitOfWork.EmployeeDetailsRepository.Get().Where(x => x.PassportExpiryDate > expiryDate || x.ResidentExpiryDate > expiryDate).ToList();

        }

        private void OfficeDocumentExpiryRemainderJob(EmailService emailService)
        {
            var expiryDate = DateTime.Today.AddDays(10);

            var officeDocumentDetails = from od in UnitOfWork.OfficeDocDetailsRepository.Get()
                                        join dt in UnitOfWork.DocumentTypeRepository.Get() on od.DocumentId equals dt.DocumentId
                                        select new OfficeDocDetailsViewModel()
                                        {
                                            DocumentName = dt.DocumentName,
                                            DocIssueDate = od.DocIssueDate,
                                            DocExpiryDate = od.DocExpiryDate

                                        };


            var managerUser = from managers in UnitOfWork.UserRepository.Get()
                              where managers.UserTypeID == Convert.ToInt32(ConstantVariables.UserType.Manager)
                              select managers;
            foreach (var item in managerUser)
            {
                strManagerMails = strManagerMails != string.Empty ? strManagerMails + ", " + item.MailAddress : item.MailAddress;

            }

            string strBody = EmailTemplateHelper.GetMailBody(officeDocumentDetails)
                .Replace("[APPLICATIONLINK]", "http://localhost:8080"); ;

            emailService.Send(strManagerMails, "", "Office document expiry remainder", strBody);
        }
    }
}
