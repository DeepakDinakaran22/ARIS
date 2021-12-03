using Aris.Data;
using Aris.Data.Entities;
using Aris.Models.Helper;
using Aris.Models.ViewModel;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ArisWorkforceManagementTool.Areas.Attendance.Controllers
{
    [Area("Attendance")]
    public class AttendanceController : Controller
    {

        UnitOfWork unitOfWork = new UnitOfWork();
        private readonly ILogger<AttendanceController> _logger;
        private readonly IWebHostEnvironment webHostEnvironment;

        public AttendanceController(ILogger<AttendanceController> logger, IWebHostEnvironment hostEnvironment)
        {
            _logger = logger;
            this.webHostEnvironment = hostEnvironment;

        }
        

        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public JsonResult AutoComplete(string prefix)
        {
            try
            {
                var employeeNumbers = (from emps in unitOfWork.EmployeeDetailsRepository.Get(x => x.IsActive == 1)
                                 where emps.EmployeeName.ToLower().StartsWith(prefix.ToLower())

                                 select new
                                 {
                                     label = emps.EmployeeName,
                                     value = emps.EmployeeName

                                 }).ToList();
                return Json(employeeNumbers);




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
        public JsonResult GetEmployeeAttendance(AttendanceViewModel obj)
        
        {
            try
            {


                List<EmployeeDetails> employees= unitOfWork.EmployeeDetailsRepository.Get(x => x.IsActive == 1).ToList();
                List <Aris.Data.Entities.Attendance> attendances = unitOfWork.AttendanceRepository.Get(null, x => x.OrderBy(id => id.EmployeeNo)).ToList();
                var result = from emp in employees
                             join att in attendances
                             on emp.EmployeeReferenceNo equals att.EmployeeNo into eGroup
                             where (emp.EmployeeReferenceNo == obj.EmployeeNo)
                             from att in eGroup.DefaultIfEmpty()
                             select new
                             {

                                 employeeNo = emp.EmployeeReferenceNo,
                                 joiningDate = emp.JoiningDate,
                                 employeeName = emp.EmployeeName,
                                 annualLeave = att == null ? 0 : att.AnnualLeave,
                                 balanceLeave = att == null ? 0 : att.BalanceLeave,
                                 totalLeave = att == null ? 0 : att.TotalLeave,
                                 leaveTaken = att == null ? 0 : att.LeaveTaken,
                                 sickLeaveJustified = att == null ? 0 : att.SickLeaveJustified,
                                 nonJustifiedLeave = att == null ? 0 : att.NonJustifiedLeave,
                                 unpaidLeave = att == null ? 0 : att.UnpaidLeave,
                                 sickLeaveBalance = att == null ? 0 : att.SickLeaveBalance,
                                 leaveBalance = att == null ? 0 : att.LeaveBalance,
                                 createdDate = att == null ? null : att.CreatedDate,
                                 attendanceId = att == null ? 0 : att.AttendanceId

                             };
                return Json(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                return null;
            }

        }
        [HttpPost]
        public JsonResult SubmitAttendance(AttendanceViewModel obj)
        {
            try
            {
                var employee = new Aris.Data.Entities.Attendance()
                {
                    AnnualLeave = obj.AnnualLeave,
                    BalanceLeave = obj.BalanceLeave,
                    TotalLeave = obj.TotalLeave,
                    LeaveTaken = obj.LeaveTaken,
                    SickLeaveJustified = obj.SickLeaveJustified,
                    NonJustifiedLeave = obj.NonJustifiedLeave,
                    UnpaidLeave = obj.UnpaidLeave,
                    SickLeaveBalance = obj.SickLeaveBalance,
                    LeaveBalance = obj.LeaveBalance,
                    EmployeeNo = obj.EmployeeNo,
                    Remarks= (obj.Remarks),
                    IsActive = 1,
                    CreatedDate = DateTime.Now,
                    CreatedBy = Convert.ToInt32(TempData.Peek("UserId")),
                    AttendanceId = obj.AttendanceId,
                  
                };
                int attendances = unitOfWork.AttendanceRepository.Get(x=>x.EmployeeNo==obj.EmployeeNo).ToList().Count();
                if (attendances == 1)
                {

                    unitOfWork.AttendanceRepository.Update(employee);
                    unitOfWork.Save();

                }
                else
                {

                    unitOfWork.AttendanceRepository.Insert(employee);
                    unitOfWork.Save();

                }


                return Json(new { success = true,  responseText = attendances==0? "Attendance details submitted successfully" :"Attendance details updated succssfully"});
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                return Json(new { success = false, responseText = "Something went wrong." });
            }
        }


    }
}
