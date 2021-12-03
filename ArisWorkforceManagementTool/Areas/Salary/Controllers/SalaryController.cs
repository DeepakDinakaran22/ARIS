using Aris.Data;
using Aris.Models.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ArisWorkforceManagementTool.Areas.Salary.Controllers
{
    [Area("Salary")]
    public class SalaryController : Controller
    {

        UnitOfWork unitOfWork = new UnitOfWork();
        private readonly ILogger<SalaryController> _logger;
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
        
        [HttpPost]
        public JsonResult AutoCompleteENo(string prefix)
        
        {
            try
            {
                var employees = (from emps in unitOfWork.EmployeeDetailsRepository.Get(x => x.IsActive == 1)
                                 where emps.EmployeeNo.ToString().StartsWith(prefix)

                                 select new
                                 {
                                     label = emps.EmployeeNo
                                 }).ToList();
                return Json(employees);

            }
            catch (Exception ex)
            {
                return null;
            }
        }
        [HttpGet]
        public JsonResult GetEmployeeSalary(SalaryViewModel obj)
        {
            try
            {
                var salaries = unitOfWork.SalaryRepository.Get(null, x => x.OrderBy(id => id.EmployeeNo));
                var employee = unitOfWork.EmployeeDetailsRepository.Get(null,x => x.OrderBy(id => id.EmployeeNo));
                var result = from emp in employee
                             join sal in salaries
                             on emp.EmployeeNo equals sal.EmployeeNo into eGroup
                             where (obj.EmployeeName is null || emp.EmployeeName.ToLower() == obj.EmployeeName)
                             from sal in eGroup.DefaultIfEmpty()
                             select new
                             {
                                 employeeNo = sal.EmployeeNo,
                                 employeeName=emp.EmployeeName,
                                 joiningDate=emp.JoiningDate,
                                 bankAccountNumber=emp.BankAccountNumber,
                                 overtimeOrExtraduty = sal.OvertimeOrExtraDuties,
                                 transpotationAllowance = sal.TranspotationAllowance,
                                 otherAllowance = sal.OtherAllowance,
                                 telephoneAllowance = sal.TelephoneAllowance,
                                 foodAllowance = sal.FoodAllowance,
                                 taxiCharges = sal.TaxiCharges,
                                 roomRent = sal.RoomRent,
                                 serviceBenefits=sal.ServiceBenefits,
                                 grossSalary = sal.GrossSalary,
                                 socialInsurance = sal.SocialInsurance,
                                 leaveDeduction = sal.LeaveDeduction,
                                 advanceDeduction = sal.AdvanceDeduction,
                                 otherDeduction = sal.OtherAllowance,
                                 totalDeduction = sal.TotalDeduction,
                                 netSalary = sal.NetSalary,
                                 remarks = sal.Remarks,
                                 basic = sal.Basic,
                                 totalSalaryPayment = sal.TotalSalaryPayment,
                                 modeOfPayment = sal.ModeOfPayment,
                                 salaryApprovalStatusId=sal.SalaryApprovalStatusId,
                                 nextActionId=sal.NextActionId,
                                 approvedBy=sal.ApprovedBy,
                                 checkedBy=sal.CheckedBy,
                                 preparedBy=sal.PreparedBy,
                                 createdDate=sal.CreatedDate,
                                 createdBy=sal.CreatedBy,
                                 modifiedBy=sal.ModifiedBy,
                                 modifiedDate=sal.ModifiedDate
                                


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
