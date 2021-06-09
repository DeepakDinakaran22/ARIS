using System;

namespace Aris.Models.ViewModel
{
    public class ExpiredDocuments
    {
        public string DocumentName { get; set; }
        public string EmployeeName { get; set; }
        public DateTime? ExpiryDate { get; set; }
    }
}
