using Aris.Common;
using Aris.Data;
using Aris.Models;
using Aris.Models.Helper;
using Aris.Models.ViewModel;
using Hangfire;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Aris.Webjob
{
    public class ExpiryRemainderServiceProvider : IExpiryRemainderServiceProvider
    {
        private readonly AppSettings _appSettings;
        public ExpiryRemainderServiceProvider(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
        }
        public static readonly string remainderJob = "RemainderJob";

        UnitOfWork UnitOfWork = new UnitOfWork();
        private string strManagerMails;


        public void RemainderWorker(IJobCancellationToken jobCancellationToken)
        {
            RecurringJob.AddOrUpdate(remainderJob, () => MailRemainder(),
                Cron.Daily);
        }

        public void MailRemainder()
        {
            EmailService emailService = new EmailService(_appSettings);
            GetRecepients();
            OfficeDocumentExpiryJob(emailService);
            EmployeeDocumentExpiryJob(emailService);
            ComapanyDocumentExpiryJob(emailService);
        }

        private void ComapanyDocumentExpiryJob(EmailService emailService)
        {
            var expiryDate = DateTime.Today.AddDays(10);

            var companyDocumentDetails = from cd in UnitOfWork.CompanyRepository.Get()
                                         join cf in UnitOfWork.CompanyFileUploadsRepository.Get() on cd.CompanyId equals cf.CompanyId
                                         join dt in UnitOfWork.DocumentTypeRepository.Get() on cf.DocumentId equals dt.DocumentId
                                         where cf.CompanyExpiry < expiryDate
                                         select new CompanyViewModel()
                                         {
                                             CompanyName = cd.CompanyName + "-" + cd.CompanyLocation,
                                             DocumentName = dt.DocumentName,
                                             CompanyExpiry = cf.CompanyExpiry

                                         };

            if (companyDocumentDetails != null)
            {
                string strBody = EmailTemplateHelper.CompanyDocumentDetails(companyDocumentDetails)
                    .Replace("[APPLICATIONLINK]", "https://aris-amt.com");

                emailService.Send(strManagerMails, "", "Company Document Expiry Reminder", strBody);
            }
            else
            {
                Console.WriteLine("No mails to send");
            }

        }

        private void EmployeeDocumentExpiryJob(EmailService emailService)
        {
            List<ExpiredDocuments> expireds = new List<ExpiredDocuments>();
            var expiryDate = DateTime.Today.AddDays(10).Date;
            var passportDetails = from ed in UnitOfWork.EmployeeDetailsRepository.Get()
                                  where ed.PassportExpiryDate < expiryDate
                                  select new
                                  ExpiredDocuments
                                  {
                                      DocumentName = "Passport",
                                      EmployeeName = ed.EmployeeName,
                                      ExpiryDate = ed.PassportExpiryDate
                                  };
            expireds.Add(passportDetails?.FirstOrDefault());
            var data = UnitOfWork.EmployeeDetailsRepository.Get();
            var residentDetails = from ed in UnitOfWork.EmployeeDetailsRepository.Get()
                                  where ed.ResidentExpiryDate < expiryDate
                                  select new
                                  ExpiredDocuments
                                  {
                                      DocumentName = "Resident",
                                      EmployeeName = ed.EmployeeName,
                                      ExpiryDate = ed.PassportExpiryDate
                                  };
            expireds.Add(residentDetails?.FirstOrDefault());
            var contractDetails = from ed in UnitOfWork.EmployeeDetailsRepository.Get()
                                  where ed.ContractEndDate < expiryDate
                                  select new
                                  ExpiredDocuments
                                  {
                                      DocumentName = "Contract",
                                      EmployeeName = ed.EmployeeName,
                                      ExpiryDate = ed.PassportExpiryDate
                                  };
            expireds.Add(contractDetails?.FirstOrDefault());

            var userDocuments = from ef in UnitOfWork.EmployeeFileUploadsRepository.Get()
                                join dt in UnitOfWork.DocumentTypeRepository.Get() on ef.DocumentId equals dt.DocumentId
                                join ed in UnitOfWork.EmployeeDetailsRepository.Get() on ef.EmployeeReferenceNo equals ed.EmployeeReferenceNo
                                where ef.ExpiryDate != null && ef.ExpiryDate < expiryDate
                                select new ExpiredDocuments()
                                {
                                    DocumentName = dt.DocumentName,
                                    EmployeeName = ed.EmployeeName,
                                    ExpiryDate = ef.ExpiryDate

                                };
            if (userDocuments != null)
                expireds.AddRange(userDocuments);
            if (expireds != default(List<ExpiredDocuments>))
            {
                string strBody = EmailTemplateHelper.UserDocumentDetails(expireds)
                  .Replace("[APPLICATIONLINK]", "https://aris-amt.com");

                emailService.Send(strManagerMails, "", "Employee Document Expiry Reminder", strBody);
            }
            else
            {
                Console.WriteLine("No mails to send");
            }
        }

        private void OfficeDocumentExpiryJob(EmailService emailService)
        {
            var expiryDate = DateTime.Today.AddDays(10);

            var officeDocumentDetails = from od in UnitOfWork.OfficeDocDetailsRepository.Get()
                                        join dt in UnitOfWork.DocumentTypeRepository.Get() on od.DocumentId equals dt.DocumentId
                                        where od.DocExpiryDate < expiryDate
                                        select new OfficeDocDetailsViewModel()
                                        {
                                            DocumentName = dt.DocumentName,
                                            DocIssueDate = od.DocIssueDate,
                                            DocExpiryDate = od.DocExpiryDate

                                        };

            if (officeDocumentDetails != null)
            {
                string strBody = EmailTemplateHelper.OfficeDocumentDetails(officeDocumentDetails)
                    .Replace("[APPLICATIONLINK]", "https://aris-amt.com");

                emailService.Send(strManagerMails, "", "Office Document Expiry Reminder", strBody);
            }
            else
            {
                Console.WriteLine("No mails to send");
            }
        }

        private void GetRecepients()
        {
            var managerUser = from managers in UnitOfWork.UserRepository.Get()
                              where managers.UserTypeID == Convert.ToInt32(ConstantVariables.UserType.Manager) || managers.UserTypeID == Convert.ToInt32(ConstantVariables.UserType.Admin)
                              select managers;
            foreach (var item in managerUser)
            {
                strManagerMails = strManagerMails != string.Empty ? strManagerMails + ", " + item.MailAddress : item.MailAddress;
            }
        }
    }
}
