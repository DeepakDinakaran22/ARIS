using System;
using System.Collections.Generic;
using System.Text;

namespace Aris.Data.Entities
{
    public class UserType
    {
        public int UserTypeID { get; set; }

        public string UserTypes { get; set; }

        public int IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }
    }
}
