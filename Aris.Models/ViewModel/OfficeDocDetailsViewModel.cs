using System;
using System.Collections.Generic;
using System.Text;

namespace Aris.Models.ViewModel
{
    public class OfficeDocDetailsViewModel
    {
        public int OfficeDocId { get; set; }
        public int DocumentId { get; set; }
        public DateTime DocIssueDate { get; set; }
        public DateTime DocExpiryDate { get; set; }
        public string OfficeDocDesc { get; set; }

        public int IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }
    }
}
