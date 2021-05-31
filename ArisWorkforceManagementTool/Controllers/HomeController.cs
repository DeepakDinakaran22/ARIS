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
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ArisWorkforceManagementTool.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        UnitOfWork UnitOfWork = new UnitOfWork();
        UnitOfWork objUnitOfWorkFetch = new UnitOfWork();


        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }
        [Authorize]
        public IActionResult Index()
        {
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
                var employees = UnitOfWork.EmployeeDetailsRepository.Get(x => x.ApprovalStatus == 0);
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
        [HttpGet]
        public JsonResult GetDashboardValuesHomeLanding()
        {
            try
            {
                var active = UnitOfWork.EmployeeDetailsRepository.Get(x => x.IsActive== 1 && x.ApprovalStatus==2);
                var pending = UnitOfWork.EmployeeDetailsRepository.Get(x => x.IsActive == 1 && x.ApprovalStatus == 0);
                var sendBack = UnitOfWork.EmployeeDetailsRepository.Get(x => x.IsActive == 1 && x.ApprovalStatus == 1);
                var Modification = UnitOfWork.EmployeeDetailsRepository.Get(x => x.IsActive == 1 && x.ApprovalStatus == 3);
                return Json(new { active = active.Count(),pending = pending.Count(),sendBack = sendBack.Count(),Modification=Modification.Count() });
            }
            catch (Exception ex)
            {
                if (ex.Message == "Sequence contains no elements")
                {
                    return Json(new { active  = 0, pending = 0, sendBack = 0, Modification =0 });
                }
                else
                {
                    return Json(new { active = 0, pending = 0, sendBack = 0, Modification = 0 });
                }
            }
        }
        [HttpGet]
        public JsonResult CheckCurrentPassword(int userId,string pwd)
        {
            bool existingPassword = false;

            var allUsers = UnitOfWork.UserRepository.Get(x => x.UserId == userId);
           foreach(var item in allUsers)
            {
                existingPassword = new Aris.Models.AuthHelper().VerifyHashedPassword(item.Password, pwd);
            }

            if (existingPassword)
            {
                return Json(new { value = true, responseText = "Password is correct" });
            }
            else
            {
                return Json(new { value = false, responseText = "Please enter correct password" });
            }

        }
        [HttpGet]
        public JsonResult UpdateNewPassword(int userId, string pwd)
        {
            if (userId != 0)
            {
                var fetchedUser = objUnitOfWorkFetch.UserRepository.Get(x => x.UserId == userId).ToList();
               
                DateTime createdDate = Convert.ToDateTime(fetchedUser[0].CreatedDate);
                int createdBy = Convert.ToInt32(fetchedUser[0].CreatedBy);

                var user = new Aris.Data.Entities.Users
                {
                    UserId = fetchedUser[0].UserId,
                    UserName = fetchedUser[0].UserName,
                    FullName = fetchedUser[0].FullName,
                    UserTypeID = fetchedUser[0].UserTypeID,
                    MailAddress = fetchedUser[0].MailAddress,
                    IsActive = fetchedUser[0].IsActive,
                    CreatedBy = createdBy,
                    CreatedDate = createdDate,
                    ModifiedBy = userId,
                    ModifiedDate = DateTime.Now,
                    UserImage = fetchedUser[0].UserImage,
                    Password = new Aris.Models.AuthHelper().GetHashPassword(pwd),
                    
                };

                UnitOfWork.UserRepository.Update(user);
                UnitOfWork.Save();

                return Json(new { success = true, responseText = "User Password updated." });
            }
            else
            {
                return Json(new { success = false, responseText = "Something went wrong." });
            }

        }
    }
}
