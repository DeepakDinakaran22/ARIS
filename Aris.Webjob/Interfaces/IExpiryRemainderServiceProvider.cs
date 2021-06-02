using Hangfire;

namespace Aris.Webjob
{
    public interface IExpiryRemainderServiceProvider
    {
        void RemainderWorker(IJobCancellationToken jobCancellationToken);
    }
}