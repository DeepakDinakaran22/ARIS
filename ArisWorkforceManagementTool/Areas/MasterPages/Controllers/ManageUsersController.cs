using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ArisWorkforceManagementTool.Models;
using Aris.Data;
using Aris.Data.Entities;
using Aris.Models.ViewModel;
using Microsoft.Extensions.Logging;
using Users = Aris.Models.ViewModel.Users;
using Aris.Models;

namespace ArisWorkforceManagementTool.Areas.MasterPages.Controllers
{
    [Area("MasterPages")]
    public class ManageUsersController : Controller
    {
        private readonly ILogger<ManageUsersController> _logger;
        UnitOfWork UnitOfWork = new UnitOfWork();
        // GET: ManageUsers
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetUsers() => Json(UnitOfWork.UserRepository.Get(null, x => x.OrderBy(id => id.UserId)).ToList());

        // GET: ManageUsers/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: ManageUsers/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: ManageUsers/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

      

        // POST: ManageUsers/Edit/5
        [HttpPost]
        //[ValidateAntiForgeryToken]
        public JsonResult UpdateUser(Users users)
        {
            try
            {
                var user = new Aris.Data.Entities.Users
                {
                    UserId = users.UserId,
                    UserName=users.UserName,
                    FullName = users.FullName,
                    UserTypeID = users.UserTypeID,
                    MailAddress=users.MailAddress,
                    IsActive = users.IsActive
                };
                UnitOfWork.UserRepository.Update(user);
                UnitOfWork.Save();

                return Json(new { success = true, responseText = "User updated successfully." });
            }
            catch
            {
                return Json(new { success = false, responseText = "Something went wrong." });
            }
        }

        // GET: ManageUsers/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: ManageUsers/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
        [HttpPost]
        //[ValidateAntiForgeryToken]
        public JsonResult SubmitRequest(Users userObj)
        {
            try
            {
                var user = new Aris.Data.Entities.Users()
                {
                    UserName = userObj.UserName,
                    MailAddress = userObj.MailAddress,
                    UserTypeID = userObj.UserTypeID,
                    IsActive = userObj.IsActive,
                    CreatedDate = DateTime.Now,
                    FullName = userObj.FullName,
                    Password = new AuthHelper().HashPassword()
                };

                UnitOfWork.UserRepository.Insert(user);
                UnitOfWork.Save();

                return Json(new { success = true, responseText = "User Added Successfully." });
            }
            catch
            {
                return Json(new { success = true, responseText = "Something Went Wrong!" });
            }
        }
        [HttpGet]
        public JsonResult IsUserNameExists(Users userObj)
        {
            var users = UnitOfWork.UserRepository.Get();
            bool has = users.ToList().Any(x => x.UserName == userObj.UserName);
            if (has)
            {
                return Json(new { value = true, responseText = "User name exists" });
            }
            else
            {
                return Json(new { value = false, responseText = "User name is not exists" });
            }

        }
    }
}