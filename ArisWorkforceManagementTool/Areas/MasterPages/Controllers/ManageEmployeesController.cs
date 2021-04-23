using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Aris.Data;
using Aris.Data.Entities;
using Aris.Models.ViewModel;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace ArisWorkforceManagementTool.Areas.MasterPages.Controllers
{
    [Area("MasterPages")]
    public class ManageEmployeesController : Controller
    {
        private readonly ILogger<ManageUsersController> _logger;
        UnitOfWork UnitOfWork = new UnitOfWork();

        // GET: ManageEmployees
        public ActionResult Index()
        {
            return View();
        }

        // GET: ManageEmployees/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: ManageEmployees/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: ManageEmployees/Create
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

        // GET: ManageEmployees/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: ManageEmployees/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: ManageEmployees/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: ManageEmployees/Delete/5
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
        [HttpGet]
        public JsonResult GetCompanies()
        {
            var companies = UnitOfWork.CompanyRepository.Get(x => x.IsActive == 1).ToList();

            return Json(companies);

        }

        [HttpPost]
        public JsonResult UploadFiles(EmployeeFileUploadsViewModel modelObj)
        {
            try
            {
                var files = new EmployeeFileUploads() { FileName = modelObj.FileName };

                UnitOfWork.EmployeeFileUploadsRepository.Insert(files);
                UnitOfWork.Save();

                return Json(new { success = true, responseText = "Company added successfully." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, responseText = "Something went wrong" });
            }
        }

        [HttpPost]
        public JsonResult SubmitRequest(EmployeeDetailsViewModel obj)
        {
            try
            {
                var employee = new EmployeeDetails() {
                    EmployeeName = obj.EmployeeName,
                    CompanyId = obj.CompanyId,
                    Nationality = obj.Nationality,
                    PassportNumber = obj.PassportNumber,
                    PassportExpiryDate = obj.PassportExpiryDate,
                    ResidentNumber = obj.ResidentNumber,
                    ResidentExpiryDate = obj.ResidentExpiryDate,
                    JoiningDate = obj.JoiningDate,
                    ContractStartDate = obj.ContractStartDate,
                    ContractEndDate = obj.ContractEndDate,
                    Gsm = obj.Gsm,
                    AccomodationDetails = obj.AccomodationDetails,
                    MaritalStatus = obj.MaritalStatus,
                    IDProfession = obj.IDProfession,
                    Designation = obj.Designation,
                    BankName = obj.BankName,
                    BankAccountNumber = obj.BankAccountNumber,
                    ApprovalStatus = 0,
                    EmployeeReferenceNo = obj.EmployeeReferenceNo,
                    IsActive = 1,
                    CreatedDate = DateTime.Now,
                    CreatedBy = 1
                };

                UnitOfWork.EmployeeDetailsRepository.Insert(employee);
                UnitOfWork.Save();

                return Json(new { success = true, responseText = "Employee details submitted for approval" });
            }
            catch
            {
                return Json(new { success = false, responseText = "Something went wrong." });
            }
        }

        [HttpGet]
        public JsonResult GetAllEmployees()
        {
            var employees = UnitOfWork.EmployeeDetailsRepository.Get(null, x => x.OrderBy(id => id.EmployeeNo));
            return Json(employees);

        }
        [HttpPost]
        public JsonResult UpdateRequest(EmployeeDetailsViewModel obj)
        {
            try
            {
                var employee = new EmployeeDetails()
                {
                    EmployeeNo = obj.EmployeeNo,
                    EmployeeName = obj.EmployeeName,
                    CompanyId = obj.CompanyId,
                    Nationality = obj.Nationality,
                    PassportNumber = obj.PassportNumber,
                    PassportExpiryDate = obj.PassportExpiryDate,
                    ResidentNumber = obj.ResidentNumber,
                    ResidentExpiryDate = obj.ResidentExpiryDate,
                    JoiningDate = obj.JoiningDate,
                    ContractStartDate = obj.ContractStartDate,
                    ContractEndDate = obj.ContractEndDate,
                    Gsm = obj.Gsm,
                    AccomodationDetails = obj.AccomodationDetails,
                    MaritalStatus = obj.MaritalStatus,
                    IDProfession = obj.IDProfession,
                    Designation = obj.Designation,
                    BankName = obj.BankName,
                    BankAccountNumber = obj.BankAccountNumber,
                    ApprovalStatus = 0,
                    IsActive = 1,
                    ModifiedDate = DateTime.Now,
                    ModifiedBy = 1
                };
                UnitOfWork.EmployeeDetailsRepository.Update(employee);
                UnitOfWork.Save();

                return Json(new { success = true, responseText = "Employee details updated successfully." });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, responseText = "Something went wrong." });
            }

        }

        [HttpGet]
        public JsonResult GetEmployeeReferenceNo()
        {
            try
            {
                var employees = UnitOfWork.EmployeeDetailsRepository.Get(null, x => x.OrderByDescending(id => id.EmployeeNo)).First();
                var EmployeeReferenceNo = Convert.ToInt32(employees.EmployeeReferenceNo)+1;
                return Json(new { success = true, responseText = EmployeeReferenceNo });
            }
        catch(Exception ex)
            {
                if(ex.Message== "Sequence contains no elements")
                {
                    return Json(new { success = true, responseText = 1 });
                }
                else
                {
                    return Json(new { success = false, responseText = "Something went wrong." });
                }
            }
        }

    }

}