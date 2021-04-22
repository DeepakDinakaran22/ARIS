using System;
using System.Collections.Generic;
using System.Text;

namespace Aris.Data.Entities
{
   public class ErrorLog
    {
        public int ErrorId { get; set; }

        public string Message { get; set; }

        public string Method { get; set; }

        public string InnerException { get; set; }
        public DateTime ErrorDate { get; set; }


    }
}
