using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Aris.Data;
using Microsoft.Extensions.Logging;
using Aris.Common;
using Microsoft.Extensions.Options;
using Aris.Models.ViewModel;

namespace ArisWorkforceManagementTool.Areas.Reports
{
    [Area("Reports")]

    public class ReportsController : Controller
    {
        UnitOfWork unitOfWork = new UnitOfWork();
        private readonly ILogger<ReportsController> _logger;

       
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

                                 select new {
                                     label = emps.EmployeeName
                                 }).ToList();
                return Json(employees);




            }
            catch(Exception ex)
            {
                return null;
            }
        }
        [HttpPost]
        public JsonResult AutoCompleteNumber(string prefix)
        {
            try
            {
                var employees = (from emps in unitOfWork.EmployeeDetailsRepository.Get(x => x.IsActive == 1)
                                 where emps.EmployeeReferenceNo.ToString().StartsWith(prefix)

                                 select new
                                 {
                                     label = emps.EmployeeReferenceNo
                                 }).ToList();
                return Json(employees);




            }
            catch (Exception ex)
            {
                return null;
            }
        }
        [HttpGet]
        public JsonResult GetAllEmployeeReports(EmployeeDetailsViewModel obj)
        {
            try
            {
                var employees = unitOfWork.EmployeeDetailsRepository.Get(null, x => x.OrderBy(id => id.EmployeeNo));
                var clients = unitOfWork.CompanyRepository.Get(null);
               var result=  from emps in employees
                join comp in clients
                on emps.CompanyId equals comp.CompanyId into eGroup
                where (obj.EmployeeName is null || emps.EmployeeName.ToLower()==obj.EmployeeName) &&
                (obj.EmployeeReferenceNo is null || emps.EmployeeReferenceNo==obj.EmployeeReferenceNo) &&
                (obj.ApprovalStatus is null || emps.ApprovalStatus== obj.ApprovalStatus) &&
                (obj.CompanyId is null || emps.CompanyId==obj.CompanyId)
                            from comp in eGroup.DefaultIfEmpty()
                            select new
                            {
                                CompanyName = comp.CompanyName + "-" + comp.CompanyLocation,
                                employeeNo = emps.EmployeeNo,
                                employeeReferenceNo = emps.EmployeeReferenceNo,
                                approvalStatus = emps.ApprovalStatus,
                                employeeName = emps.EmployeeName,
                                passportNumber = emps.PassportNumber,
                                passportExpiryDate = emps.PassportExpiryDate,
                                residentNumber = emps.ResidentNumber,
                                residentExpiryDate = emps.ResidentExpiryDate,
                                joiningDate = emps.JoiningDate,
                                contractStartDate = emps.ContractStartDate,
                                contractEndDate = emps.ContractEndDate,
                                gsm = emps.Gsm,
                                accomodationDetails = emps.AccomodationDetails,
                                maritalStatus = emps.MaritalStatus,
                                idProfession = emps.IDProfession,
                                designation = emps.Designation,
                                bankName = emps.BankName,
                                bankAccountNumber = emps.BankAccountNumber,
                                remarks=emps.Remarks


                            };
                return Json(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                return null;
            }

        }
    }
}