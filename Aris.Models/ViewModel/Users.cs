using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Aris.Models.ViewModel
{
    
        public class Users
        {
            public int UserId { get; set; }

        [Required(ErrorMessage = "Please enter user name")]
            public string UserName { get; set; } 

            public string Password { get; set; }

        [Required]
            public string FullName { get; set; }
        [Required(ErrorMessage = "Please enter Email ID")]
        [RegularExpression(@"^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$", ErrorMessage = "Email is not valid.")]
        public string MailAddress { get; set; }

            public string UserImage { get; set; }

        [Required]
            public int UserTypeID { get; set; }

        [Required]
            public int? IsActive { get; set; }

            public int? CreatedBy { get; set; }

            public DateTime? CreatedDate { get; set; }

            public int? ModifiedBy { get; set; }

            public DateTime? ModifiedDate { get; set; }
        }
}
