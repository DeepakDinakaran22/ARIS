using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Aris.Common;
using Aris.Data;
using Aris.Data.Entities;
using Aris.Models;
using Aris.Models.ViewModel;
using Aris.Models.Helper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authorization;


namespace ArisWorkforceManagementTool.Areas.MasterPages.Controllers
{
    [Area("MasterPages")]
    public class ManageEmployeesController : Controller
    {
        private readonly ILogger<ManageEmployeesController> _logger;
        UnitOfWork UnitOfWork = new UnitOfWork();
        UnitOfWork objUnitOfWorkFetched = new UnitOfWork();
        private readonly IWebHostEnvironment webHostEnvironment;
        private string imagePath = string.Empty;
        public int UserTypeId { get; set; }
        private readonly AppSettings _appSettings;
        private static string employeeImage;

        public ManageEmployeesController(IWebHostEnvironment hostEnvironment, IOptions<AppSettings> appSettings, ILogger<ManageEmployeesController> logger)
        {
            this.webHostEnvironment = hostEnvironment;
            _appSettings = appSettings.Value;
            _logger = logger;
        }

        // GET: ManageEmployees
        [Authorize]
        public ActionResult Index()
        {
            UserTypeId = Convert.ToInt32(TempData.Peek("UserRole"));
            return View();
        }

        [HttpGet]
        public JsonResult GetCompanies()
        {
            try
            {
                var companies = UnitOfWork.CompanyRepository.Get(x => x.IsActive == 1).ToList().OrderBy(o => o.CompanyName);
                foreach (var item in companies)
                {
                    item.CompanyName = item.CompanyName + '-' + item.CompanyLocation;
                }

                return Json(companies);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.ToString());
                return null;
            }

        }

        [HttpPost]
        public JsonResult UploadFiles(EmployeeFileUploadsViewModel modelObj)
        {
            try
            {
                var files = new EmployeeFileUploads() { FileName = modelObj.FileName };

                UnitOfWork.EmployeeFileUploadsRepository.Insert(files);
                UnitOfWork.Save();

                return Json(new { success = true, responseText = "Client added successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
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
                    Remarks=obj.Remarks,
                    IsActive = 1,
                    CreatedDate = DateTime.Now,
                    CreatedBy = Convert.ToInt32(TempData.Peek("UserId")),
                    EmployeeImage = obj.EmployeeImage
                };

                UnitOfWork.EmployeeDetailsRepository.Insert(employee);
                UnitOfWork.Save();

                var uploadedData =   UnitOfWork.EmployeeFileUploadsRepository.Get(f => f.IsValid == 0 && f.EmployeeReferenceNo == obj.EmployeeReferenceNo);
                foreach (var item in uploadedData)
                {
                    item.IsValid = 1;
                    item.ModifiedBy = Convert.ToInt32(TempData.Peek("UserId"));
                    item.ModifiedDate = DateTime.Now;
                    UnitOfWork.EmployeeFileUploadsRepository.Update(item);
                    UnitOfWork.Save();
                }


                #region send mail
                if (Convert.ToBoolean(ConstantVariables.SendMailNotification.Status))
                {
                    string strManagerNames = string.Empty;
                    string strManagerMails = string.Empty;
                    var userData = UnitOfWork.UserRepository.Get(u => u.IsActive == 1);
                    var loggedInUser = (from users in userData
                                       where users.UserId == Convert.ToInt32(TempData.Peek("UserId"))
                                       select users).FirstOrDefault();
                    var managerUser = from managers in userData
                                      where managers.UserTypeID == Convert.ToInt32(ConstantVariables.UserType.Manager)
                                      select managers;
                    foreach (var item in managerUser)
                    {
                        strManagerNames = strManagerNames == string.Empty ? item.FullName : strManagerNames + ", " + item.FullName;
                        strManagerMails = strManagerMails == string.Empty ? item.MailAddress : strManagerMails + ", " + item.MailAddress;

                    }

                    string strBody = EmailTemplateHelper.submitEmployeeDetails;
                    strBody = strBody.Replace("[USER]", strManagerNames)
                        .Replace("[LOGGEDINUSER]",loggedInUser.FullName)
                        .Replace("[EMPID]", obj.EmployeeReferenceNo.ToString())
                        .Replace("[EMPNAME]", obj.EmployeeName)
                        .Replace("[PASSPORTNO]", obj.PassportNumber)
                        .Replace("[RESIDENTNO]", obj.ResidentNumber)
                        .Replace("[PASSPORTEXPIRY]",Convert.ToDateTime(obj.PassportExpiryDate).ToString("yyyy-MM-dd"))
                        .Replace("[RESIDENTEXPIRY]", Convert.ToDateTime(obj.ResidentExpiryDate).ToString("yyyy-MM-dd"))
                        .Replace("[GSMNO]", obj.Gsm.ToString())
                        .Replace("[REMARKS]", obj.Remarks)
                        .Replace("[APPLICATIONLINK]", "https://aris-amt.com/");
                    EmailService emailService = new EmailService(_appSettings);
                    emailService.Send(strManagerMails,loggedInUser.MailAddress, "An employee details submitted for your action", strBody);
                }
                #endregion
                return Json(new { success = true, responseText = "Employee details submitted for approval" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                return Json(new { success = false, responseText = "Something went wrong." });
            }
        }

        [HttpGet]
        public JsonResult GetAllEmployees()
        {
            try
            {
                var employees = UnitOfWork.EmployeeDetailsRepository.Get(null, x => x.OrderBy(id => id.EmployeeNo));
                return Json(employees);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.ToString());
                return null;
            }

        }
        [HttpPost]
        public JsonResult UpdateRequest(EmployeeDetailsViewModel obj)
        {
            try
            {
                var empExistingData = objUnitOfWorkFetched.EmployeeDetailsRepository.Get(x => x.EmployeeNo == obj.EmployeeNo).ToList();

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
                    Remarks = obj.Remarks,
                    IsActive = 1,
                    ModifiedDate = DateTime.Now,
                    ModifiedBy = Convert.ToInt32(TempData.Peek("UserId")),
                    CreatedDate = empExistingData[0].CreatedDate,
                    CreatedBy = empExistingData[0].CreatedBy,
                    EmployeeReferenceNo = obj.EmployeeReferenceNo,
                    EmployeeImage = obj.EmployeeImage == null ? empExistingData[0].EmployeeImage : obj.EmployeeImage
                };
                UnitOfWork.EmployeeDetailsRepository.Update(employee);
                UnitOfWork.Save();

                var uploadedData = UnitOfWork.EmployeeFileUploadsRepository.Get(f => f.IsValid == 0 && f.EmployeeReferenceNo == obj.EmployeeReferenceNo);
                foreach (var item in uploadedData)
                {
                    item.IsValid = 1;
                    item.ModifiedBy = Convert.ToInt32(TempData.Peek("UserId"));
                    item.ModifiedDate = DateTime.Now;
                    UnitOfWork.EmployeeFileUploadsRepository.Update(item);
                    UnitOfWork.Save();
                }

                #region send mail
                if (Convert.ToBoolean(ConstantVariables.SendMailNotification.Status))
                {
                    string strManagerNames = string.Empty;
                    string strManagerMails = string.Empty;
                    var userData = UnitOfWork.UserRepository.Get(u => u.IsActive == 1);
                    var loggedInUser = (from users in userData
                                        where users.UserId == Convert.ToInt32(TempData.Peek("UserId"))
                                        select users).FirstOrDefault();
                    var managerUser = from managers in userData
                                      where managers.UserTypeID == Convert.ToInt32(ConstantVariables.UserType.Manager)
                                      select managers;
                    foreach (var item in managerUser)
                    {
                        strManagerNames = strManagerNames == string.Empty ? item.FullName : strManagerNames + ", " + item.FullName;
                        strManagerMails = strManagerMails == string.Empty ? item.MailAddress : strManagerMails + ", " + item.MailAddress;

                    }

                    string strBody = EmailTemplateHelper.reSubmitEmployeeDetails;
                    strBody = strBody.Replace("[USER]", strManagerNames)
                        .Replace("[LOGGEDINUSER]", loggedInUser.FullName)
                        .Replace("[EMPID]", obj.EmployeeReferenceNo.ToString())
                        .Replace("[EMPNAME]", obj.EmployeeName)
                        .Replace("[PASSPORTNO]", obj.PassportNumber)
                        .Replace("[RESIDENTNO]", obj.ResidentNumber)
                        .Replace("[PASSPORTEXPIRY]", Convert.ToDateTime(obj.PassportExpiryDate).ToString("yyyy-MM-dd"))
                        .Replace("[RESIDENTEXPIRY]", Convert.ToDateTime(obj.ResidentExpiryDate).ToString("yyyy-MM-dd"))
                        .Replace("[GSMNO]", obj.Gsm.ToString())
                        .Replace("[REMARKS]", obj.Remarks)
                        .Replace("[APPLICATIONLINK]", "https://aris-amt.com/");
                    EmailService emailService = new EmailService(_appSettings);
                    emailService.Send(strManagerMails, loggedInUser.MailAddress, "An employee details have been re-submitted for your action", strBody);
                }
                #endregion

                return Json(new { success = true, responseText = "Employee details updated successfully." });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                return Json(new { success = false, responseText = "Something went wrong." });
            }

        }
        [HttpPost]
        public JsonResult ApproveRequest(EmployeeDetailsViewModel obj)
        {
            try
            {
                var empExistingData = objUnitOfWorkFetched.EmployeeDetailsRepository.Get(x => x.EmployeeNo == obj.EmployeeNo).ToList();

                var employee = new EmployeeDetails()
                {
                    EmployeeNo = empExistingData[0].EmployeeNo,
                    EmployeeName = empExistingData[0].EmployeeName,
                    CompanyId = empExistingData[0].CompanyId,
                    Nationality = empExistingData[0].Nationality,
                    PassportNumber = empExistingData[0].PassportNumber,
                    PassportExpiryDate = empExistingData[0].PassportExpiryDate,
                    ResidentNumber = empExistingData[0].ResidentNumber,
                    ResidentExpiryDate = empExistingData[0].ResidentExpiryDate,
                    JoiningDate = empExistingData[0].JoiningDate,
                    ContractStartDate = empExistingData[0].ContractStartDate,
                    ContractEndDate = empExistingData[0].ContractEndDate,
                    Gsm = empExistingData[0].Gsm,
                    AccomodationDetails = empExistingData[0].AccomodationDetails,
                    MaritalStatus = empExistingData[0].MaritalStatus,
                    IDProfession = empExistingData[0].IDProfession,
                    Designation = empExistingData[0].Designation,
                    BankName = empExistingData[0].BankName,
                    BankAccountNumber = empExistingData[0].BankAccountNumber,
                    ApprovalStatus = 2,
                    Remarks = obj.Remarks,
                    IsActive = 1,
                    ModifiedDate = DateTime.Now,
                    ModifiedBy = Convert.ToInt32(TempData.Peek("UserId")),
                    CreatedDate = empExistingData[0].CreatedDate,
                    CreatedBy = empExistingData[0].CreatedBy,
                    EmployeeReferenceNo = empExistingData[0].EmployeeReferenceNo,
                    EmployeeImage =  empExistingData[0].EmployeeImage 
                };
                UnitOfWork.EmployeeDetailsRepository.Update(employee);
                UnitOfWork.Save();

                #region send mail
                if (Convert.ToBoolean(ConstantVariables.SendMailNotification.Status))
                {
                    string strManagerNames = string.Empty;
                    string strManagerMails = string.Empty;
                    string strAdminMails = string.Empty;
                    var userData = UnitOfWork.UserRepository.Get(u => u.IsActive == 1);
                    var loggedInUser = (from users in userData
                                        where users.UserId == Convert.ToInt32(TempData.Peek("UserId"))
                                        select users).FirstOrDefault();
                    var managerUser = from managers in userData
                                      where managers.UserTypeID == Convert.ToInt32(ConstantVariables.UserType.Manager)
                                      select managers;
                    foreach (var item in managerUser)
                    {
                        strManagerNames = strManagerNames == string.Empty ? item.FullName : strManagerNames + ", " + item.FullName;
                        strManagerMails = strManagerMails == string.Empty ? item.MailAddress : strManagerMails + ", " + item.MailAddress;

                    }
                    var adminUser = from admins in userData
                                      where admins.UserTypeID == Convert.ToInt32(ConstantVariables.UserType.Admin)
                                      select admins;
                    foreach (var item in adminUser)
                    {
                        strAdminMails = strAdminMails == string.Empty ? item.MailAddress : strAdminMails + ", " + item.MailAddress;

                    }

                    string strBody = EmailTemplateHelper.approvedEmployeeDetails;
                    strBody = strBody.Replace("[USER]", strManagerNames)
                        .Replace("[LOGGEDINUSER]", loggedInUser.FullName)
                        .Replace("[EMPID]", empExistingData[0].EmployeeReferenceNo.ToString())
                        .Replace("[EMPNAME]", empExistingData[0].EmployeeName)
                        .Replace("[PASSPORTNO]", empExistingData[0].PassportNumber)
                        .Replace("[RESIDENTNO]", empExistingData[0].ResidentNumber)
                        .Replace("[PASSPORTEXPIRY]", Convert.ToDateTime(empExistingData[0].PassportExpiryDate).ToString("yyyy-MM-dd"))
                        .Replace("[RESIDENTEXPIRY]", Convert.ToDateTime(empExistingData[0].ResidentExpiryDate).ToString("yyyy-MM-dd"))
                        .Replace("[GSMNO]", empExistingData[0].Gsm.ToString())
                        .Replace("[REMARKS]", obj.Remarks)
                        .Replace("[APPLICATIONLINK]", "https://aris-amt.com/");
                    EmailService emailService = new EmailService(_appSettings);
                    emailService.Send(strAdminMails, strManagerMails, "An employee details have been approved | Aris-"+ empExistingData[0].EmployeeReferenceNo, strBody);
                }
                #endregion

                return Json(new { success = true, responseText = "Employee details Approved and Saved to the system successfully." });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                return Json(new { success = false, responseText = "Something went wrong." });
            }

        }

        [HttpPost]
        public JsonResult SendBackRequest(EmployeeDetailsViewModel obj)
        {
            try
            {
                var empExistingData = objUnitOfWorkFetched.EmployeeDetailsRepository.Get(x => x.EmployeeNo == obj.EmployeeNo).ToList();

                var employee = new EmployeeDetails()
                {
                    EmployeeNo = empExistingData[0].EmployeeNo,
                    EmployeeName = empExistingData[0].EmployeeName,
                    CompanyId = empExistingData[0].CompanyId,
                    Nationality = empExistingData[0].Nationality,
                    PassportNumber = empExistingData[0].PassportNumber,
                    PassportExpiryDate = empExistingData[0].PassportExpiryDate,
                    ResidentNumber = empExistingData[0].ResidentNumber,
                    ResidentExpiryDate = empExistingData[0].ResidentExpiryDate,
                    JoiningDate = empExistingData[0].JoiningDate,
                    ContractStartDate = empExistingData[0].ContractStartDate,
                    ContractEndDate = empExistingData[0].ContractEndDate,
                    Gsm = empExistingData[0].Gsm,
                    AccomodationDetails = empExistingData[0].AccomodationDetails,
                    MaritalStatus = empExistingData[0].MaritalStatus,
                    IDProfession = empExistingData[0].IDProfession,
                    Designation = empExistingData[0].Designation,
                    BankName = empExistingData[0].BankName,
                    BankAccountNumber = empExistingData[0].BankAccountNumber,
                    ApprovalStatus = 1,
                    Remarks = obj.Remarks,
                    IsActive = 1,
                    ModifiedDate = DateTime.Now,
                    ModifiedBy = Convert.ToInt32(TempData.Peek("UserId")),
                    CreatedDate = empExistingData[0].CreatedDate,
                    CreatedBy = empExistingData[0].CreatedBy,
                    EmployeeReferenceNo = empExistingData[0].EmployeeReferenceNo,
                    EmployeeImage = empExistingData[0].EmployeeImage
                };
                UnitOfWork.EmployeeDetailsRepository.Update(employee);
                UnitOfWork.Save();
                #region send mail
                if (Convert.ToBoolean(ConstantVariables.SendMailNotification.Status))
                {
                    string strManagerNames = string.Empty;
                    string strManagerMails = string.Empty;
                    string strCreatedUser = string.Empty;
                    var userData = UnitOfWork.UserRepository.Get(u => u.IsActive == 1);
                    var loggedInUser = (from users in userData
                                        where users.UserId == Convert.ToInt32(TempData.Peek("UserId"))
                                        select users).FirstOrDefault();
                    var createdUser = (from users in userData
                                        where users.UserId == Convert.ToInt32(empExistingData[0].CreatedBy)
                                        select users).FirstOrDefault();
                    var managerUser = from managers in userData
                                      where managers.UserTypeID == Convert.ToInt32(ConstantVariables.UserType.Manager)
                                      select managers;
                    foreach (var item in managerUser)
                    {
                        strManagerNames = strManagerNames == string.Empty ? item.FullName : strManagerNames + ", " + item.FullName;
                        strManagerMails = strManagerMails == string.Empty ? item.MailAddress : strManagerMails + ", " + item.MailAddress;

                    }

                    string strBody = EmailTemplateHelper.sendBackEmployeeDetails;
                    strBody = strBody.Replace("[USER]", createdUser.FullName.ToUpper())
                        .Replace("[LOGGEDINUSER]", loggedInUser.FullName.ToUpper())
                        .Replace("[EMPID]", empExistingData[0].EmployeeReferenceNo.ToString())
                        .Replace("[EMPNAME]", empExistingData[0].EmployeeName.ToString())
                        .Replace("[REMARKS]", obj.Remarks)
                        .Replace("[APPLICATIONLINK]", "https://aris-amt.com/");
                    EmailService emailService = new EmailService(_appSettings);
                    emailService.Send(createdUser.MailAddress, strManagerMails, "An employee details have been Sent Back | Aris-" + empExistingData[0].EmployeeReferenceNo, strBody);
                }
                #endregion
                return Json(new { success = true, responseText = "Employee details have been sent back to admin." });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
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
                    _logger.LogError(ex.ToString());
                    return Json(new { success = false, responseText = "Something went wrong." });
                }
            }
        }

        [HttpPost]
        public async Task<IActionResult> UploadImage(IList<IFormFile> files,string empNo)
        {
            try
            {
                string filename = string.Empty;
                foreach (IFormFile source in files)
                {
                    filename = ContentDispositionHeaderValue.Parse(source.ContentDisposition).FileName.Trim('"');

                    filename = DateTime.Now.ToFileTime() + "_" + this.EnsureCorrectFilename(filename);
                    employeeImage = filename;
                    imagePath = filename;

                    using (FileStream output = System.IO.File.Create(this.GetPathAndFilename(filename, empNo)))
                        await source.CopyToAsync(output);
                }

                return Json(new { success = true, responseText = "Employee Image updated successfully.", profileImagePath = imagePath, imageFullPath = this.GetFullImagePathAndFilename(filename, empNo) });
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.ToString());
                return Json(new { success = false, responseText = "Something went wrong.", profileImagePath = imagePath, imageFullPath = this.GetFullImagePathAndFilename("FileName", empNo) });

            }
        }

        [HttpPost]
        public async Task<IActionResult> UploadDocuments(IList<IFormFile> files, string empNo, int docId)
        {
            try
            {
                string filename = string.Empty;
                string actualFileName = string.Empty;
                
                var uploadedData = UnitOfWork.EmployeeFileUploadsRepository.Get(f => f.IsValid == 1 && f.EmployeeReferenceNo == Convert.ToInt32(empNo.Replace("ARIS-", "")) && f.DocumentId ==docId);
               
                if (uploadedData.Count() == 0)
                {
                    foreach (IFormFile source in files)
                    {
                        filename = ContentDispositionHeaderValue.Parse(source.ContentDisposition).FileName.Trim('"');
                        actualFileName = this.EnsureCorrectFilename(filename);
                        filename = DateTime.Now.ToFileTime() + "_" + actualFileName;
                        imagePath = filename;

                        using (FileStream output = System.IO.File.Create(this.GetPathAndFilename(filename, empNo)))
                            await source.CopyToAsync(output);

                        var fileDetails = new EmployeeFileUploads()
                        {
                            EmployeeReferenceNo = Convert.ToInt32(empNo.Replace("ARIS-", "")),
                            IsActive = 1,
                            CreatedBy = Convert.ToInt32(TempData.Peek("UserId")),
                            CreatedDate = DateTime.Now,
                            IsValid = 0,
                            DocumentId = docId,
                            ActualFileName = actualFileName,
                            FileName = filename,
                            FileLocation = GetFullDocumentPathWithoutFileName(empNo)

                        };

                        var uploadedDataGet = UnitOfWork.EmployeeFileUploadsRepository.Get(f => f.IsValid == 0 && f.DocumentId == docId);
                        foreach (var item in uploadedDataGet)
                        {
                            UnitOfWork.EmployeeFileUploadsRepository.Delete(item.EmpFileUploadId);
                            UnitOfWork.Save();
                        }

                        UnitOfWork.EmployeeFileUploadsRepository.Insert(fileDetails);
                        UnitOfWork.Save();
                    }
                }
                else
                {
                    foreach (IFormFile source in files)
                    {
                        filename = ContentDispositionHeaderValue.Parse(source.ContentDisposition).FileName.Trim('"');
                        actualFileName = this.EnsureCorrectFilename(filename);
                        filename = DateTime.Now.ToFileTime() + "_" + actualFileName;
                        imagePath = filename;

                        using (FileStream output = System.IO.File.Create(this.GetPathAndFilename(filename, empNo)))
                            await source.CopyToAsync(output);

                        foreach (var item in uploadedData)
                        {
                            item.ActualFileName = item.ActualFileName == actualFileName ? item.ActualFileName : actualFileName;
                            item.FileName = item.ActualFileName == filename ? item.FileName : filename;
                            item.FileLocation = GetFullDocumentPathWithoutFileName(empNo);
                            item.ModifiedBy = item.CreatedBy;
                            item.ModifiedDate = DateTime.Now;
                              
                            UnitOfWork.EmployeeFileUploadsRepository.Update(item);
                            UnitOfWork.Save();
                        }
                    }

                }

                return Json(new { success = true, responseText = "Employee Image updated successfully.", profileImagePath = imagePath, imageFullPath = this.GetFullImagePathAndFilename(filename, empNo) });
            }
            catch(Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                return Json(new { success = false, responseText = "Something went wrong. Please try again !"});

            }
        }
        [HttpPost]
        public async Task<IActionResult> UploadDocumentsRemaining(IList<IFormFile> files, string empNo, int docId, string expdate)
        {
            try
            {
                string filename = string.Empty;
                string actualFileName = string.Empty;

                var uploadedData = UnitOfWork.EmployeeFileUploadsRepository.Get(f => f.IsValid == 1 && f.EmployeeReferenceNo == Convert.ToInt32(empNo.Replace("ARIS-", "")) && f.DocumentId == docId);

                if (uploadedData.Count() == 0)
                {
                    if(expdate== "No Expiry Required")
                    {
                        expdate = null;
                    }
                    foreach (IFormFile source in files)
                    {
                        filename = ContentDispositionHeaderValue.Parse(source.ContentDisposition).FileName.Trim('"');
                        actualFileName = this.EnsureCorrectFilename(filename);
                        filename = DateTime.Now.ToFileTime() + "_" + actualFileName;
                        imagePath = filename;

                        using (FileStream output = System.IO.File.Create(this.GetPathAndFilename(filename, empNo)))
                            await source.CopyToAsync(output);

                        var fileDetails = new EmployeeFileUploads()
                        {
                            EmployeeReferenceNo = Convert.ToInt32(empNo.Replace("ARIS-", "")),
                            IsActive = 1,
                            CreatedBy = Convert.ToInt32(TempData.Peek("UserId")),
                            CreatedDate = DateTime.Now,
                            IsValid = 0,
                            DocumentId = docId,
                            ActualFileName = actualFileName,
                            FileName = filename,
                            FileLocation = GetFullDocumentPathWithoutFileName(empNo),
                            ExpiryDate = expdate==null?DateTime.MinValue:Convert.ToDateTime(expdate)

                        };

                        var uploadedDataGet = UnitOfWork.EmployeeFileUploadsRepository.Get(f => f.IsValid == 0 && f.DocumentId == docId);
                        foreach (var item in uploadedDataGet)
                        {
                            UnitOfWork.EmployeeFileUploadsRepository.Delete(item.EmpFileUploadId);
                            UnitOfWork.Save();
                        }

                        UnitOfWork.EmployeeFileUploadsRepository.Insert(fileDetails);
                        UnitOfWork.Save();
                    }
                }
                else
                {
                    foreach (IFormFile source in files)
                    {
                        filename = ContentDispositionHeaderValue.Parse(source.ContentDisposition).FileName.Trim('"');
                        actualFileName = this.EnsureCorrectFilename(filename);
                        filename = DateTime.Now.ToFileTime() + "_" + actualFileName;
                        imagePath = filename;

                        using (FileStream output = System.IO.File.Create(this.GetPathAndFilename(filename, empNo)))
                            await source.CopyToAsync(output);

                        foreach (var item in uploadedData)
                        {
                            item.ActualFileName = item.ActualFileName == actualFileName ? item.ActualFileName : actualFileName;
                            item.FileName = item.ActualFileName == filename ? item.FileName : filename;
                            item.FileLocation = GetFullDocumentPathWithoutFileName(empNo);
                            item.ExpiryDate = item.ExpiryDate == Convert.ToDateTime(expdate) ? item.ExpiryDate : Convert.ToDateTime(expdate);
                            item.ModifiedBy = item.CreatedBy;
                            item.ModifiedDate = DateTime.Now;

                            UnitOfWork.EmployeeFileUploadsRepository.Update(item);
                            UnitOfWork.Save();
                        }
                    }

                }

                return Json(new { success = true, responseText = "Employee Image updated successfully.", profileImagePath = imagePath, imageFullPath = this.GetFullImagePathAndFilename(filename, empNo) });
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                return Json(new { success = false, responseText = "Something went wrong. Please try again !" });

            }
        }
        private string EnsureCorrectFilename(string filename)
        {
            try
            {
                if (filename.Contains("\\"))
                    filename = filename.Substring(filename.LastIndexOf("\\") + 1);

                return filename;
            }
            catch(Exception ex)
            {

                _logger.LogInformation(ex.ToString());
                return null;
            }
        }

        private string GetPathAndFilename(string filename,string empNo)
        {
            try
            {
                if (Directory.Exists(this.webHostEnvironment.WebRootPath + "\\Uploads\\EmployeeUploads\\" + empNo))
                {
                    return this.webHostEnvironment.WebRootPath + "\\Uploads\\EmployeeUploads\\" + empNo + "\\" + filename;

                }
                else
                {
                    Directory.CreateDirectory(this.webHostEnvironment.WebRootPath + "\\Uploads\\EmployeeUploads\\" + empNo);
                    return this.webHostEnvironment.WebRootPath + "\\Uploads\\EmployeeUploads\\" + empNo + "\\" + filename;

                }
            }
            catch(Exception ex)
            {
                
                _logger.LogInformation(ex.ToString());
                return null;
            }
        }
        private string GetFullImagePathAndFilename(string filename, string empNo)
        {
            try
            {
            
            return "\\Uploads\\EmployeeUploads\\" + empNo + "\\" + filename;
            }
            catch(Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                return null;
            }
        }
        private string GetFullDocumentPathWithoutFileName(string empNo)
        {
            try
            {
                return "\\Uploads\\EmployeeUploads\\" + empNo + "\\";
            }
            catch(Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                return null;
            }
        }

        #region Upload documents section
        [HttpGet]
        public JsonResult GetAllUploads(string uploadType, int EmpRefNo)
        {
            try
            {
                List<DocumentType> documents = UnitOfWork.DocumentTypeRepository.Get(x => x.IsActive == 1).ToList();
                List<EmployeeFileUploads> files = UnitOfWork.EmployeeFileUploadsRepository.Get(x => x.IsActive == 1 && x.EmployeeReferenceNo == EmpRefNo).ToList();
                #region commented
                var data = from d in documents
                           join f in files
                           on d.DocumentId equals f.DocumentId into eGroup
                           where d.DocumentCategoryID == 1 && !(d.DocumentName.ToLower().Contains("passport")) && !(d.DocumentName.ToLower().Contains("resident"))
                           from f in eGroup.DefaultIfEmpty()
                           select new
                           {
                               docFileUploadId = f == null ?0 : f.EmpFileUploadId,
                               FileName = f == null ? "No Files" : f.ActualFileName,
                               FilePath = f == null ? "No Path" : f.FileLocation + f.FileName,
                               DocumentName = d.DocumentName,
                               DocumentId = d.DocumentId,
                               isExpiryRequired = d.IsExpiryRequired,
                               expiryDate = f == null ? null : Convert.ToDateTime(f.ExpiryDate).ToString("yyyy-MM-dd"),
                               isMandatory = d == null ? 0 : d.IsMandatory
                           };
                switch (uploadType)
                {
                    case "PASSPORT":
                        data = from d in documents
                               join f in files
                               on d.DocumentId equals f.DocumentId into eGroup
                               where d.DocumentCategoryID == 1 && d.DocumentName.ToLower().Contains("passport")
                               from f in eGroup.DefaultIfEmpty()
                               select new
                               {
                                   docFileUploadId = f == null ? 0 : f.EmpFileUploadId,
                                   FileName = f == null ? "No Files" : f.ActualFileName,
                                   FilePath = f == null ? "No Path" : f.FileLocation + f.FileName,
                                   DocumentName = d.DocumentName,
                                   DocumentId = d.DocumentId,
                                   isExpiryRequired = d.IsExpiryRequired,
                                   expiryDate = f == null ? null : Convert.ToDateTime(f.ExpiryDate).ToString("yyyy-MM-dd"),
                                   isMandatory = d == null ? 0 : d.IsMandatory
                               };

                        break;
                    case "RESIDENT":
                        data = from d in documents
                               join f in files
                               on d.DocumentId equals f.DocumentId into eGroup
                               where d.DocumentCategoryID == 1 && d.DocumentName.ToLower().Contains("resident")
                               from f in eGroup.DefaultIfEmpty()
                               select new
                               {
                                   docFileUploadId = f == null ? 0 : f.EmpFileUploadId,
                                   FileName = f == null ? "No Files" : f.ActualFileName,
                                   FilePath = f == null ? "No Path" : f.FileLocation + f.FileName,
                                   DocumentName = d.DocumentName,
                                   DocumentId = d.DocumentId,
                                   isExpiryRequired = d.IsExpiryRequired,
                                   expiryDate = f == null ? null : Convert.ToDateTime(f.ExpiryDate).ToString("yyyy-MM-dd"),
                                   isMandatory = d == null ? 0 : d.IsMandatory
                               };

                        break;


                }
                #endregion

                return Json(data);
            }
            catch(Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                return null;
            }
        
        }

        [HttpGet]
        public JsonResult DeleteInValidUploads(string empNo, int userID )
        {
            try
            {
                var uploadedData = UnitOfWork.EmployeeFileUploadsRepository.Get(f => f.IsValid == 0 && f.CreatedBy == userID && f.EmployeeReferenceNo== Convert.ToInt32(empNo.Replace("ARIS-", "")));
                string fileLocation = this.webHostEnvironment.WebRootPath + "\\Uploads\\EmployeeUploads\\" + empNo+"\\";
               
                foreach (var item in uploadedData)
                    {
                        UnitOfWork.EmployeeFileUploadsRepository.Delete(item.EmpFileUploadId);
                        UnitOfWork.Save();
                    if (System.IO.File.Exists(fileLocation + item.FileName))
                    {
                        System.IO.File.Delete(fileLocation + item.FileName);
                    }
                    if (System.IO.File.Exists(fileLocation + employeeImage))
                    {
                        System.IO.File.Delete(fileLocation + employeeImage);

                    }
                }
                return Json(new { success = true, responseText = "success" });
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                return Json(new { success = false, responseText = "Something went wrong. Please try again !" });
            }
        }
        #endregion

        [HttpGet]
        public JsonResult IsEmployeeNameExists(EmployeeDetails obj)
        {
            try
            {
                var employees = UnitOfWork.EmployeeDetailsRepository.Get();
                bool has = employees.ToList().Any(x => x.PassportNumber == obj.PassportNumber);
                if (has)
                {
                    return Json(new { value = true, responseText = "Employee name exists" });
                }
                else
                {
                    return Json(new { value = false, responseText = "Employee name is not exists" });
                }
            }
            catch(Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                return null;
            }

        }
        [HttpGet]
        public JsonResult DeleteSelectedFiles(int docUploadId,string empId)
        {
            try
            {

                var uploadedData = UnitOfWork.EmployeeFileUploadsRepository.Get(f =>  f.EmpFileUploadId == Convert.ToInt32(docUploadId));
                string fileLocation = this.webHostEnvironment.WebRootPath + "\\Uploads\\EmployeeUploads\\"+empId+"\\";

                foreach (var item in uploadedData)
                {

                    UnitOfWork.EmployeeFileUploadsRepository.Delete(item.EmpFileUploadId);
                    UnitOfWork.Save();

                    if (System.IO.File.Exists(fileLocation + item.FileName))
                    {
                        System.IO.File.Delete(fileLocation + item.FileName);
                    }
                }

                return Json(new { success = true, responseText = "success" });


            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                return Json(new { success = false, responseText = "Something went wrong. Please try again !" });

            }
        }

    }

}