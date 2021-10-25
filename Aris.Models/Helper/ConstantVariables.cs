using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace Aris.Models.Helper
{
   public class ConstantVariables
    {
        public enum  UserType
        {
            Admin = 1,
            Manager = 2
        }
        public enum ApplicationData
        {
            [Description("https://aris-amt.com")]
            ApplicationLink = 1
        }


        public enum SendMailNotification
        {
            Status = 0,
        }
    }
}
