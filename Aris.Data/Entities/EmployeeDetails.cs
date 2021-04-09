using System;
using System.Collections.Generic;
using System.Text;

namespace Aris.Data.Entities
{
    public class EmployeeDetails
    {
        public int EmployeeNo { get; set; }

        public string EmployeeName { get; set; }

        public int? CompanyId { get; set; }

        public string Nationality { get; set; }

        public string PassportNumber { get; set; }

        public DateTime? PassportExpiryDate { get; set; }

        public string ResidentNumber { get; set; }

        public DateTime? ResidentExpiryDate { get; set; }

        public DateTime? JoiningDate { get; set; }

        public DateTime? ContractStartDate { get; set; }

        public DateTime? ContractEndDate { get; set; }

        public int? Gsm { get; set; }

        public string AccomodationDetails { get; set; }

        public string MaritalStatus { get; set; }

        public string IDProfession { get; set; }

        public string Designation { get; set; }

        public string BankName { get; set; }

        public string BankAccountNumber { get; set; }

        public string EmployeeImage { get; set; }

        public int? IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }
    }
}
