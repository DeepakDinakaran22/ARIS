using System.Threading.Tasks;

namespace Aris.Webjob
{
    internal interface IEmailJob
    {
        Task Sent();
    }
}