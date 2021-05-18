using System;

namespace Aris.Data.Entities
{
    public class UserType
    {
        public int UserTypeID { get; set; }

        public string UserRole { get; set; }

        public int IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }
    }
}
