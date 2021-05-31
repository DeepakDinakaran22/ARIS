using Hangfire;
using Microsoft.AspNetCore.Builder;

namespace Aris.Webjob.Extensions
{
    public static class AppBuilderExtension
    {
        public static void UseBackgroundJobs(this IApplicationBuilder app)

        {
            BackgroundJob.Enqueue<IRemainderServiceProvider>(x => x.RemainderWorker(JobCancellationToken.Null));
        }
    }
}
