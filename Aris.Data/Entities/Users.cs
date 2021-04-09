using System;
using System.Collections.Generic;
using System.Text;

namespace Aris.Data.Entities
{
    public class Users
    {
        public int UserId { get; set; }

        public string UserName { get; set; }

        public string Password { get; set; }

        public string FullName { get; set; }

        public string MailAddress { get; set; }

        public string UserImage { get; set; }

        public int UserTypeID { get; set; }

        public int? IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }
    }
}
