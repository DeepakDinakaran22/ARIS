using Aris.Common.Interfaces;
using Aris.Data;
using Hangfire;
using System;

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
        public void RemainderWorker(IJobCancellationToken jobCancellationToken)
        {
            RecurringJob.AddOrUpdate(remainderJob, () => MailRemainder(),
                Cron.Daily);
        }

        public void MailRemainder()
        {
            //send mail
            emailService.Send("", "", "");
            var data = UnitOfWork.UserRepository.Get();
            Console.WriteLine("Deepak");
        }
    }
}
