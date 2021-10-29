using Aris.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ArisWorkforceManagementTool.Areas.Attendance.Controllers
{
    [Area("Attendance")]
    public class AttendanceController : Controller
    {

        UnitOfWork unitOfWork = new UnitOfWork();
        private readonly ILogger<AttendanceController> _logger;
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
                                 where emps.EmployeeName.ToLower().StartsWith(prefix.ToLower())

                                 select new
                                 {
                                     label = emps.EmployeeName
                                 }).ToList();
                return Json(employees);




            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
