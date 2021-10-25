using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ArisWorkforceManagementTool.Areas.Salary.Controllers
{
    [Area("Salary")]
    public class SalaryController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}
