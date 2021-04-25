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

        [HttpPost]
        public JsonResult SubmitRequest(CompanyViewModel companyObj)
        {
            try
            {
                var company = new Company() { CompanyName = companyObj.CompanyName, CompanyServices = companyObj.CompanyServices, IsActive = companyObj.IsActive, CreatedDate = DateTime.Now, CreatedBy = 1, CompanyLocation=companyObj.CompanyLocation };

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
        public JsonResult UpdateRequest(CompanyViewModel companyObj)
        {try
            {
                var company = new Company() { CompanyName=companyObj.CompanyName, CompanyServices = companyObj.CompanyServices, IsActive = companyObj.IsActive, ModifiedDate = DateTime.Now,ModifiedBy  = 1,CompanyId=companyObj.CompanyId,CompanyLocation=companyObj.CompanyLocation };
                UnitOfWork.CompanyRepository.Update(company);
                UnitOfWork.Save();

                return Json(new { success = true, responseText = "Company updated successfully." });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, responseText = "Something went wrong." });
            }

        }
        [HttpGet]
        public JsonResult GetAllCompanies()
        {
            var companies = UnitOfWork.CompanyRepository.Get(null,x=>x.OrderByDescending(id=>id.CompanyId));
            return Json(companies);

        }
        [HttpGet]
        public JsonResult IsCompanyNameExists(CompanyViewModel companyObj)
        {
            var companies = UnitOfWork.CompanyRepository.Get();
            bool has= companies.ToList().Any(x => x.CompanyName.ToLower() == companyObj.CompanyName.ToLower()&& x.CompanyLocation.ToLower()== companyObj.CompanyLocation.ToLower());
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