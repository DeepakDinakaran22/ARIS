using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aris.Data;
using Aris.Data.Entities;
using Aris.Models.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ArisWorkforceManagementTool.Areas.MasterPages.Controllers
{
    [Area("MasterPages")]
    public class ManageCompanyController : Controller
    {
        private readonly ILogger<ManageUsersController> _logger;
        UnitOfWork UnitOfWork = new UnitOfWork();
        // GET: ManageCompany
        public ActionResult Index()
        {
            return View();
        }

        // GET: ManageCompany/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: ManageCompany/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: ManageCompany/Create
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

        // GET: ManageCompany/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: ManageCompany/Edit/5
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

        // GET: ManageCompany/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: ManageCompany/Delete/5
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
        public JsonResult SubmitRequest(CompanyViewModel companyObj)
        {
            try
            {
                var company = new Company() { CompanyName = companyObj.CompanyName, CompanyDescription = companyObj.CompanyDescription, IsActive = companyObj.IsActive, CreatedDate = DateTime.Now, CreatedBy = 1 };

                UnitOfWork.CompanyRepository.Insert(company);
                UnitOfWork.Save();

                return Json(new { success = true, responseText = "Company added successfully." });
            }
            catch
            {
                return Json(new { success = false, responseText = "Something went wrong." });
            }
        }
        [HttpPost]
        public ActionResult UpdateRequest(CompanyViewModel companyObj)
        {try
            {
                var company = new Company() { CompanyName = companyObj.CompanyName, CompanyDescription = companyObj.CompanyDescription, IsActive = companyObj.IsActive, ModifiedDate = DateTime.Now,ModifiedBy  = 1,CompanyId=companyObj.CompanyId };
                UnitOfWork.CompanyRepository.Update(company);
                UnitOfWork.Save();

                return RedirectToAction(nameof(Index));

            }
            catch (Exception ex)
            {
                return View();
            }

        }
        [HttpGet]
        public JsonResult GetAllCompanies()
        {
            var companies = UnitOfWork.CompanyRepository.Get();
            return Json(companies);

        }
        [HttpGet]
        public JsonResult IsCompanyNameExists(CompanyViewModel companyObj)
        {
            var companies = UnitOfWork.CompanyRepository.Get();
            bool has= companies.ToList().Any(x => x.CompanyName == companyObj.CompanyName);
            if(has)
            {
                return Json(new { value = true, responseText = "Company name exists" });
            }
            else
            {
                return Json(new { value = false, responseText = "Company name is not exists" });
            }

        }

    }
}