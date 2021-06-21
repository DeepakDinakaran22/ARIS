using System;
using System.Collections.Generic;
using System.Text;

namespace Aris.Data.Entities
{
    public class Company
    {
        public int CompanyId { get; set; }

        public string CompanyName { get; set; }

        public string CompanyServices { get; set; }

        public int? IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }
        public string CompanyLocation { get; set; }
        public DateTime? CompanyExpiry { get; set; }
        public string CompanyEmail { get; set; }
        public string CompanyPhone { get; set; }
    }
   
}
