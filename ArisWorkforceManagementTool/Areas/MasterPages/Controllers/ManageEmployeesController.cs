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
        UnitOfWork objUnitOfWorkFetched = new UnitOfWork();
        private readonly IWebHostEnvironment webHostEnvironment;
        private string imagePath = string.Empty;
        public ManageEmployeesController(IWebHostEnvironment hostEnvironment)
        {
            this.webHostEnvironment = hostEnvironment;
        }

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
            var companies = UnitOfWork.CompanyRepository.Get(x => x.IsActive == 1).ToList().OrderBy(o=>o.CompanyName);
            foreach(var item in companies)
            {
                item.CompanyName = item.CompanyName+'-'+item.CompanyLocation;
            }

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
                    Remarks=obj.Remarks,
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
                    ModifiedBy = 1,
                    CreatedDate = empExistingData[0].CreatedDate,
                    CreatedBy = empExistingData[0].CreatedBy,
                    EmployeeReferenceNo = obj.EmployeeReferenceNo
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

        [HttpPost]
        public async Task<IActionResult> UploadImage(IList<IFormFile> files,string empNo)
        {
            string filename = string.Empty;
            foreach (IFormFile source in files)
            {
                filename = ContentDispositionHeaderValue.Parse(source.ContentDisposition).FileName.Trim('"');

                filename = Guid.NewGuid().ToString() + "_" + this.EnsureCorrectFilename(filename);
                imagePath = filename;

                using (FileStream output = System.IO.File.Create(this.GetPathAndFilename(filename, empNo)))
                    await source.CopyToAsync(output);
            }

            return Json(new { success = true, responseText = "Employee Image updated successfully.", profileImagePath = imagePath, imageFullPath= this.GetFullImagePathAndFilename(filename,empNo) });
        }

        [HttpPost]
        public async Task<IActionResult> UploadDocuments(IList<IFormFile> files, string empNo, int docId)
        {
            try
            {
                string filename = string.Empty;
                string actualFileName = string.Empty;

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
                        CreatedBy = 1,
                        CreatedDate = DateTime.Now,
                        IsValid = 0,
                        DocumentId = docId,
                        ActualFileName = actualFileName,
                        FileName = filename,
                        FileLocation = GetFullDocumentPathWithoutFileName(empNo)

                    };

                    var uploadedData = UnitOfWork.EmployeeFileUploadsRepository.Get(f => f.IsValid == 0 && f.DocumentId == docId);
                    foreach(var item in uploadedData)
                    {
                        UnitOfWork.EmployeeFileUploadsRepository.Delete(item.EmpFileUploadId);
                        UnitOfWork.Save();
                    }

                    UnitOfWork.EmployeeFileUploadsRepository.Insert(fileDetails);
                    UnitOfWork.Save();
                }
               
                   
               

                return Json(new { success = true, responseText = "Employee Image updated successfully.", profileImagePath = imagePath, imageFullPath = this.GetFullImagePathAndFilename(filename, empNo) });
            }
            catch(Exception ex)
            {
                return Json(new { success = false, responseText = "Something went wrong. Please try again !"});

            }
        }
        private string EnsureCorrectFilename(string filename)
        {
            if (filename.Contains("\\"))
                filename = filename.Substring(filename.LastIndexOf("\\") + 1);

            return filename;
        }

        private string GetPathAndFilename(string filename,string empNo)
        {
            if( Directory.Exists(this.webHostEnvironment.WebRootPath + "\\Uploads\\EmployeeUploads\\"+ empNo))
            {
                return this.webHostEnvironment.WebRootPath + "\\Uploads\\EmployeeUploads\\"+empNo+"\\"+ filename;

            }
            else
            {
                Directory.CreateDirectory(this.webHostEnvironment.WebRootPath + "\\Uploads\\EmployeeUploads\\" + empNo);
                return this.webHostEnvironment.WebRootPath + "\\Uploads\\EmployeeUploads\\" + empNo + "\\" + filename;

            }
        }
        private string GetFullImagePathAndFilename(string filename,string empNo)
        {
            return "\\Uploads\\EmployeeUploads\\"+empNo+"\\"+ filename;
        }
        private string GetFullDocumentPathWithoutFileName(string empNo)
        {
            return "\\Uploads\\EmployeeUploads\\" + empNo + "\\" ;
        }

        #region Upload documents section
        [HttpGet]
        public JsonResult GetAllUploads(string uploadType)
        {

            List<DocumentType> documents = UnitOfWork.DocumentTypeRepository.Get(x => x.IsActive==1).ToList();
            List<EmployeeFileUploads>  files = UnitOfWork.EmployeeFileUploadsRepository.Get(x => x.IsActive == 1).ToList();
            #region commented
          var  data = from d in documents
                   join f in files
                   on d.DocumentId equals f.DocumentId into eGroup
                   where d.DocumentCategoryID == 1 && !(d.DocumentName.ToLower().Contains("passport")) &&!(d.DocumentName.ToLower().Contains("resident"))
                   from f in eGroup.DefaultIfEmpty()
                   select new { FileName = f == null ? "No Files" : f.ActualFileName, DocumentName = d.DocumentName, DocumentId = d.DocumentId };
            switch (uploadType)
            {
                case "PASSPORT":
                     data = from d in documents
                               join f in files
                               on d.DocumentId equals f.DocumentId into eGroup
                               where d.DocumentCategoryID == 1 && d.DocumentName.ToLower().Contains("passport")
                               from f in eGroup.DefaultIfEmpty()
                               select new { FileName = f == null ? "No Files" : f.ActualFileName, DocumentName = d.DocumentName, DocumentId = d.DocumentId };

                    break;
                case "RESIDENT":
                     data = from d in documents
                               join f in files
                               on d.DocumentId equals f.DocumentId into eGroup
                               where d.DocumentCategoryID == 1 && d.DocumentName.ToLower().Contains("resident")
                               from f in eGroup.DefaultIfEmpty()
                               select new { FileName = f == null ? "No Files" : f.ActualFileName, DocumentName = d.DocumentName, DocumentId = d.DocumentId };

                    break;
                
              
            }
            #endregion

            return Json(data);
        
        }

        [HttpGet]
        public JsonResult DeleteInValidUploads(string empNo, int userID )
        {
            try
            {
                string filename = string.Empty;
                string actualFileName = string.Empty;

               

                    var uploadedData = UnitOfWork.EmployeeFileUploadsRepository.Get(f => f.IsValid == 0 && f.CreatedBy == userID && f.EmployeeReferenceNo== Convert.ToInt32(empNo.Replace("ARIS-", "")));
                    foreach (var item in uploadedData)
                    {
                        UnitOfWork.EmployeeFileUploadsRepository.Delete(item.EmpFileUploadId);
                        UnitOfWork.Save();
                    }

                return Json(new { success = true, responseText = "success" });


            }
            catch (Exception ex)
            {
                return Json(new { success = false, responseText = "Something went wrong. Please try again !" });

            }
        }
        #endregion

    }

}