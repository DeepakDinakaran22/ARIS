using Hangfire;

namespace Aris.Webjob
{
    public interface IRemainderServiceProvider
    {
        void RemainderWorker(IJobCancellationToken jobCancellationToken);
    }
}