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
            [Description("http://magicisland:8080")]
            ApplicationLink = 1
        }


        public enum SendMailNotification
        {
            Status = 1,
        }
    }
}
