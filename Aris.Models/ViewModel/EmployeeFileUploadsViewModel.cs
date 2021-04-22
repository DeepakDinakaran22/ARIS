using System;
using System.Collections.Generic;
using System.Text;

namespace Aris.Models.ViewModel
{
   public class EmployeeFileUploadsViewModel
    {
        public int EmpFileUploadId { get; set; }

        public int? EmployeeNo { get; set; }

        public int? EmployeeOrderNo { get; set; }

        public string UploadType { get; set; }

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
