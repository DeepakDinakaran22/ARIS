using System;
using System.Collections.Generic;
using System.Text;

namespace Aris.Data.Entities
{
    public class DocumentCategory
    {
        public int DocumentCategoryID { get; set; }

        public string DocumentCategoryName { get; set; }

        public int IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }
    }
}
