using System;
using System.Collections.Generic;
using System.Text;

namespace Aris.Common.Interfaces
{
    public interface IEmailService
    {
        void Send( string to,string cc, string subject, string html);
    }
}
