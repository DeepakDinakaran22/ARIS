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
using Microsoft.AspNetCore.Authorization;
using System.Net.Http.Headers;
using System.IO;
using Microsoft.AspNetCore.Hosting;

namespace ArisWorkforceManagementTool.Areas.MasterPages.Controllers
{
    [Area("MasterPages")]
    public class ManageCompanyController : Controller
    {
        private readonly ILogger<ManageCompanyController> _logger;
        UnitOfWork UnitOfWork = new UnitOfWork();
        private readonly IWebHostEnvironment webHostEnvironment;
        private string imagePath = string.Empty;

        public ManageCompanyController( ILogger<ManageCompanyController> logger, IWebHostEnvironment hostEnvironment)
        {
            _logger = logger;
            this.webHostEnvironment = hostEnvironment;

        }
        [Authorize]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult SubmitRequest(CompanyViewModel companyObj)
        {
            try
            {
                var company = new Company() { CompanyName = companyObj.CompanyName, 
                    CompanyServices = companyObj.CompanyServices, 
                    IsActive = companyObj.IsActive, 
                    CreatedDate = DateTime.Now, 
                    CreatedBy = Convert.ToInt32(TempData.Peek("UserId")), 
                    CompanyLocation=companyObj.CompanyLocation,
                    CompanyExpiry = companyObj.CompanyExpiry,
                    CompanyPhone = companyObj.CompanyPhone,
                    CompanyEmail=companyObj.CompanyEmail
                };

                UnitOfWork.CompanyRepository.Insert(company);
                UnitOfWork.Save();

                return Json(new { success = true, responseText = "Company added successfully." });
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.ToString());
                return Json(new { success = false, responseText = "Something went wrong." });
            }
        }
        [HttpPost]
        public JsonResult UpdateRequest(CompanyViewModel companyObj)
        {
            try
            {
                var company = new Company() { CompanyName=companyObj.CompanyName, 
                    CompanyServices = companyObj.CompanyServices, 
                    IsActive = companyObj.IsActive, 
                    ModifiedDate = DateTime.Now,
                    ModifiedBy  = Convert.ToInt32(TempData.Peek("UserId")),
                    CompanyId=companyObj.CompanyId,
                    CompanyLocation=companyObj.CompanyLocation,
                    CompanyExpiry = companyObj.CompanyExpiry,
                    CompanyPhone = companyObj.CompanyPhone,
                    CompanyEmail = companyObj.CompanyEmail
                };
                UnitOfWork.CompanyRepository.Update(company);
                UnitOfWork.Save();

                return Json(new { success = true, responseText = "Client details updated successfully." });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                return Json(new { success = false, responseText = "Something went wrong." });
            }

        }
        [HttpGet]
        public JsonResult GetAllCompanies()
        {
            try
            {
                var companies = UnitOfWork.CompanyRepository.Get(null, x => x.OrderByDescending(id => id.CompanyId));
                return Json(companies);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.ToString());
                return null;
            }

        }
        [HttpGet]
        public JsonResult IsCompanyNameExists(CompanyViewModel companyObj)
        {
            try
            {
                var companies = UnitOfWork.CompanyRepository.Get();
                bool has = companies.ToList().Any(x => x.CompanyName.ToLower() == companyObj.CompanyName.ToLower() && x.CompanyLocation.ToLower() == companyObj.CompanyLocation.ToLower());
                if (has)
                {
                    return Json(new { value = true, responseText = "Client name exists" });
                }
                else
                {
                    return Json(new { value = false, responseText = "Client name is not exists" });
                }
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.ToString());
                return Json(new { value = true, responseText = "Client name exists" });

            }
        }
        [HttpGet]
        public JsonResult GetAllUploads(int companyId)
        {
            try
            {

                List<DocumentType> documents = UnitOfWork.DocumentTypeRepository.Get(x => x.IsActive == 1).ToList();
                List<CompanyFileUploads> files = UnitOfWork.CompanyFileUploadsRepository.Get(x => x.IsActive == 1 && x.CompanyId == companyId).ToList();
                var data = from d in documents
                           join f in files
                           on d.DocumentId equals f.DocumentId into eGroup
                           where d.DocumentCategoryID == 3
                           from f in eGroup.DefaultIfEmpty()
                           select new
                           {
                               FileName = f == null ? "No Files" : f.ActualFileName,
                               FilePath = f == null ? "No Path" : f.FileLocation + f.FileName,
                               DocFileUploadId = f == null ? 0 : f.CompanyFileUploadId,
                               CompanyExpiry  = f == null ? null: Convert.ToDateTime(f.CompanyExpiry).ToString("yyyy-MM-dd"),
                               
                               DocumentName = d.DocumentName,
                               DocumentId = d.DocumentId,
                               CompanyId = f == null ? 0 :f.CompanyId,
                               isExpiryRequired = d.IsExpiryRequired,
                               isMandatory = d == null ? 0 : d.IsMandatory,
                           };

                return Json(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                return null;
            }
        }
        [HttpPost]
        public async Task<IActionResult> UploadDocumentsClients(IList<IFormFile> files, int  companyId, int docId, string expdate)
        {
            try
            {
                string filename = string.Empty;
                string actualFileName = string.Empty;

                var uploadedData = UnitOfWork.CompanyFileUploadsRepository.Get(f => f.IsValid == 1 && f.CompanyId ==companyId && f.DocumentId==docId);

                foreach (IFormFile source in files)
                {
                    filename = ContentDispositionHeaderValue.Parse(source.ContentDisposition).FileName.Trim('"');
                    actualFileName = this.EnsureCorrectFilename(filename);
                    filename = DateTime.Now.ToFileTime() + "_" + actualFileName;
                    imagePath = filename;

                    using (FileStream output = System.IO.File.Create(this.GetPathAndFilename(filename)))
                        await source.CopyToAsync(output);

                    if (uploadedData.Count() == 0)
                    {
                        var fileDetails = new CompanyFileUploads()
                        {
                            DocumentId = Convert.ToInt32(docId),
                            IsActive = 1,
                            CreatedBy = Convert.ToInt32(TempData.Peek("UserId")),
                            CreatedDate = DateTime.Now,
                            IsValid = 1,
                            ActualFileName = actualFileName,
                            FileName = filename,
                            FileLocation = GetFullDocumentPathWithoutFileName(),
                            CompanyId = companyId,
                            CompanyExpiry =Convert.ToDateTime(expdate)
                        };
                        UnitOfWork.CompanyFileUploadsRepository.Insert(fileDetails);
                        UnitOfWork.Save();
                    }
                    else
                    {
                        foreach(var item in uploadedData)
                        {
                            item.ModifiedBy = Convert.ToInt32(TempData.Peek("UserId"));
                            item.ModifiedDate = DateTime.Now;
                            item.ActualFileName = actualFileName;
                            item.FileName = filename;
                            item.FileLocation = GetFullDocumentPathWithoutFileName();
                            item.CompanyExpiry = item.CompanyExpiry == Convert.ToDateTime(expdate) ? item.CompanyExpiry : Convert.ToDateTime(expdate);
                            UnitOfWork.CompanyFileUploadsRepository.Update(item);
                            UnitOfWork.Save();
                        }
                        
                    }
                }
                return Json(new { success = true, responseText = "Client documents updated successfully.", docFileName = imagePath, imageFullPath = this.GetFullImagePathAndFilename(filename) });
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
            catch (Exception ex)
            {

                _logger.LogInformation(ex.ToString());
                return null;
            }
        }
        private string GetPathAndFilename(string filename)
        {
            try
            {
                if (Directory.Exists(this.webHostEnvironment.WebRootPath + "\\Uploads\\ClientUploads"))
                {
                    return this.webHostEnvironment.WebRootPath + "\\Uploads\\ClientUploads\\" + filename;

                }
                else
                {
                    Directory.CreateDirectory(this.webHostEnvironment.WebRootPath + "\\Uploads\\ClientUploads");
                    return this.webHostEnvironment.WebRootPath + "\\Uploads\\ClientUploads\\" + filename;

                }
            }
            catch (Exception ex)
            {

                _logger.LogInformation(ex.ToString());
                return null;
            }
        }
        private string GetFullImagePathAndFilename(string filename)
        {
            try
            {

                return "\\Uploads\\ClientUploads\\" + filename;
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                return null;
            }
        }
        private string GetFullDocumentPathWithoutFileName()
        {
            try
            {
                return "\\Uploads\\ClientUploads\\";
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                return null;
            }
        }
        [HttpGet]
        public JsonResult DeleteSelectedFiles(int docUploadId)
        {
            try
            {

                var uploadedData = UnitOfWork.CompanyFileUploadsRepository.Get(f => f.CompanyFileUploadId == docUploadId);
                string fileLocation = this.webHostEnvironment.WebRootPath + "\\Uploads\\ClientUploads\\";

                    foreach (var item in uploadedData)
                {
                   
                    UnitOfWork.CompanyFileUploadsRepository.Delete(item.CompanyFileUploadId);
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