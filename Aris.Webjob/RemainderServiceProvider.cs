using Aris.Data;
using Hangfire;
using System;

namespace Aris.Webjob
{
    public class RemainderServiceProvider: IRemainderServiceProvider
    {
        public static readonly string remainderJob = "RemainderJob";
        UnitOfWork UnitOfWork = new UnitOfWork();
        public void RemainderWorker(IJobCancellationToken jobCancellationToken)
        {
            RecurringJob.AddOrUpdate(remainderJob, () => MailRemainder(),
                Cron.Daily);
        }
        
        private void MailRemainder()
        {
            //send mail
            var data=UnitOfWork.UserRepository.Get();
        }
    }
}
