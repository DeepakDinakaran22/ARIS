using System;
using System.Collections.Generic;
using System.Text;

namespace Aris.Data.Entities
{
    public class Salary
    {
        public int SalaryId { get; set; }

        public int? EmployeeNo { get; set; }

        public string OvertimeOrExtraDuties { get; set; }

        public string TranspotationAllowance { get; set; }

        public string OtherAllowance { get; set; }

        public string TelephoneAllowance { get; set; }

        public string FoodAllowance { get; set; }

        public string TaxiCharges { get; set; }

        public string RoomRent { get; set; }

        public string GrossSalary { get; set; }

        public string SocialInsurance { get; set; }

        public string LeaveDeduction { get; set; }

        public string AdvanceDeduction { get; set; }

        public string OtherDeduction { get; set; }

        public string TotalDeduction { get; set; }

        public string NetSalary { get; set; }

        public string Remarks { get; set; }

        public string Basic { get; set; }

        public string TotalSalaryPAyment { get; set; }

        public string ModeOfPayment { get; set; }

        public int? SalaryApprovalStatusId { get; set; }

        public int? NextActionId { get; set; }

        public string ApprovedBy { get; set; }

        public int? CheckedBy { get; set; }

        public int? PreparedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? CreatedBy { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

    }

}
