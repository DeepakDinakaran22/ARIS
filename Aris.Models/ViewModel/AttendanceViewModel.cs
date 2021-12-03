using System;
using System.Collections.Generic;
using System.Text;

namespace Aris.Models.ViewModel
{
    public class AttendanceViewModel
    {
        public int AttendanceId { get; set; }

        public int? EmployeeNo { get; set; }

        public int? AnnualLeave { get; set; }

        public int? BalanceLeave { get; set; }

        public int? TotalLeave { get; set; }

        public int? LeaveTaken { get; set; }

        public int? SickLeaveJustified { get; set; }

        public int? NonJustifiedLeave { get; set; }

        public int? UnpaidLeave { get; set; }

        public int? SickLeaveBalance { get; set; }

        public int? LeaveBalance { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? CreatedBy { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public int? IsActive { get; set; }
        public string EmployeeName { get; set; }
        public string JoiningDate { get; set; }
        public string Remarks { get; set; }
    }

}
