
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
using Aris.Models.Helper;
using Aris.Models;
using Aris.Common;
using Microsoft.Extensions.Options;

namespace ArisWorkforceManagementTool.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        UnitOfWork UnitOfWork = new UnitOfWork();
        UnitOfWork objUnitOfWorkFetch = new UnitOfWork();
        private readonly AppSettings _appSettings;

        public HomeController(ILogger<HomeController> logger, IOptions<AppSettings> appSettings)
        {
            _logger = logger;
            _appSettings = appSettings.Value;

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
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Unautherized()
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
                    _logger.LogInformation(ex.Message);
                    return Json(new { pendingRequests = 0 });
                }
                else
                {
                    _logger.LogError(ex.Message);
                    return Json(new { pendingRequests = 0 });
                }

            }
        }
        [HttpGet]
        public JsonResult GetDashboardValuesHomeLanding()
        {
            try
            {
                int userRole = Convert.ToInt32(TempData.Peek("UserRole"));
                int userId = Convert.ToInt32(TempData.Peek("UserId"));
                var active = UnitOfWork.EmployeeDetailsRepository.Get(x => x.IsActive== 1 && x.ApprovalStatus==2);
                var pending = UnitOfWork.EmployeeDetailsRepository.Get(x => x.IsActive == 1 && x.ApprovalStatus == 0);
                var sendBack = UnitOfWork.EmployeeDetailsRepository.Get(x => x.IsActive == 1 && x.ApprovalStatus == 1);
                var Expired = UnitOfWork.OfficeDocDetailsRepository.Get(x => x.IsActive == 1 && x.DocExpiryDate<DateTime.Today);
                return Json(new { active = active.Count(),pending = pending.Count(),sendBack = sendBack.Count(),expired=Expired.Count() });
            }
            catch (Exception ex)
            {
                if (ex.Message == "Sequence contains no elements")
                {
                    _logger.LogInformation(ex.Message);

                    return Json(new { active  = 0, pending = 0, sendBack = 0, expired =0 });
                }
                _logger.LogError(ex.ToString());

                // throw ex;
                return Json(new
                {
                    redirectUrl = Url.Action("Error", "Home"),
                    isRedirect = true
                });
            }
        }
        [HttpGet]
        public JsonResult CheckCurrentPassword(int userId,string pwd)
        {
            try
            {

                bool existingPassword = false;

                var allUsers = UnitOfWork.UserRepository.Get(x => x.UserId == userId);
                foreach (var item in allUsers)
                {
                    existingPassword = new Aris.Models.Helper.AuthHelper().VerifyHashedPassword(item.Password, pwd);
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
            catch(Exception ex)
            {
                _logger.LogError(ex.ToString());
                return Json(new { value = false, responseText = "Please enter correct password" });

            }

        }
        [HttpGet]
        public JsonResult UpdateNewPassword(int userId, string pwd)
        {
            try
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
                        Password = new AuthHelper().GetHashPassword(pwd),

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
            catch(Exception ex)
            {
                _logger.LogError(ex.ToString());

                return Json(new { success = false, responseText = "Something went wrong." });

            }

        }
    }
}
