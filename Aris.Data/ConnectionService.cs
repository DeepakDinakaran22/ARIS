using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace Aris.Data
{
    public class ConnectionService
    {
        public static string connstring = "";
        public static void Set(IConfiguration config)
        {
               connstring = config.GetConnectionString("ArisConnection");
        }
    }
}
