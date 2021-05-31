using Hangfire;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Aris.Webjob
{
    public  class JObScheduler
    {
        public static void Register()
        {
            RecurringJob.RemoveIfExists(nameof(IEmailJob));
            RecurringJob.AddOrUpdate<EmailJob>(nameof(EmailJob)),
                job=>job.Run(JobCancellationToken.Null),
                Cron.Daily,TimeZoneInfo.Local);
        }


    }
}
