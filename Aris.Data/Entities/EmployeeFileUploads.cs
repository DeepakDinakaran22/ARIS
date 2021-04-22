using System;
using System.Collections.Generic;
using System.Text;

namespace Aris.Data.Entities
{
   public class EmployeeFileUploads
    {
        public int EmpFileUploadId { get; set; }

        public string EmployeeNo { get; set; }

        public string EmployeeOrderNo { get; set; }

        public int? UploadType { get; set; }

        public string FileName { get; set; }

        public string FileLocation { get; set; }

        public int? TempEmployeeNo { get; set; }

        public int IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }
    }
}
