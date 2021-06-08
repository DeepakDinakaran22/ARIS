using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Aris.Data;

namespace ArisWorkforceManagementTool.Areas.Reports
{
    [Area("Reports")]

    public class ReportsController : Controller
    {
        UnitOfWork unitOfWork = new UnitOfWork();
       
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult AutoComplete(string prefix)
        {
            try
            {
                var employees = (from emps in unitOfWork.EmployeeDetailsRepository.Get(x => x.IsActive == 1)
                                 select emps).ToList();

                return Json(employees);
            }
            catch(Exception ex)
            {
                return null;
            }
        }
    }
}