using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ArisWorkforceManagementTool.Models;
using Aris.Data;
using Aris.Data.Entities;

namespace ArisWorkforceManagementTool.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        UnitOfWork UnitOfWork = new UnitOfWork();

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            //var user = new Users() { UserName = "Deepak", UserTypeID = 1, CreatedDate = DateTime.Now };
            //UnitOfWork.UserRepository.Insert(user);
            //UnitOfWork.Save();

           // var data = UnitOfWork.UserRepository.Get();
            return View();
        }
        public IActionResult ManagerHomeLanding()
        {
            
            return View();
        }

        public IActionResult Login()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult SubmitRequest(string userName, string emailAddress, int userType, int isActive)
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetDashboardValues()
        {
            try
            {
                var employees = UnitOfWork.EmployeeDetailsRepository.Get(x => x.ApprovalStatus==0);
                var pendingReq = Convert.ToInt32(employees.Count());
                return Json(new { pendingRequests = pendingReq });
            }
            catch (Exception ex)
            {
                if (ex.Message == "Sequence contains no elements")
                {
                    return Json(new { pendingRequests = 0 });
                }
                else
                {
                    return Json(new { pendingRequests  = 0});
                }
            }
        }
        [HttpGet]
        public JsonResult GetDashboardValuesHomeLanding()
        {
            try
            {
                var employees = UnitOfWork.EmployeeDetailsRepository.Get(x => x.ApprovalStatus == 1);
                var pendingReq = Convert.ToInt32(employees.Count());
                return Json(new { pendingRequests = pendingReq });
            }
            catch (Exception ex)
            {
                if (ex.Message == "Sequence contains no elements")
                {
                    return Json(new { pendingRequests = 0 });
                }
                else
                {
                    return Json(new { pendingRequests = 0 });
                }
            }
        }

    }
}
