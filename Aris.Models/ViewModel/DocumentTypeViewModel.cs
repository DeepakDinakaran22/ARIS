using System;
using System.Collections.Generic;
using System.Text;

namespace Aris.Models.ViewModel
{
   public class DocumentTypeViewModel
    {
        public int DocumentId { get; set; }

        public string DocumentName { get; set; }

        public string DocumentDescription { get; set; }

        public int DocumentCategoryID { get; set; }

        public int IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }
        public int? IsExpiryRequired { get; set; }
    }
}
