using System;
using System.Collections.Generic;
using System.Text;

namespace Aris.Data.Entities
{
    public class CompanyFileUploads
    {
        public int CompanyFileUploadId { get; set; }

        public int? DocumentId { get; set; }

        public string FileName { get; set; }
        public string ActualFileName { get; set; }

        public string FileLocation { get; set; }
        public int CompanyId { get; set; }
        public int? IsValid { get; set; }

        public int IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }
        public DateTime? CompanyExpiry { get; set; }

    }
}
