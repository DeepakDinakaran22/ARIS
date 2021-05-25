using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Aris.Models.ViewModel
{
    public class UserLoginModel
    {
        [Required(ErrorMessage ="Required")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Required")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }
    }
}
