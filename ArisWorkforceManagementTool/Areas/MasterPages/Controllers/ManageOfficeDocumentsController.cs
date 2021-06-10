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
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;

namespace ArisWorkforceManagementTool.Areas.MasterPages.Controllers
{
    [Area("MasterPages")]
    public class ManageOfficeDocumentsController : Controller
    {
        private readonly ILogger<ManageOfficeDocumentsController> _logger;
        UnitOfWork UnitOfWork = new UnitOfWork();
        UnitOfWork objUnitOfWorkFetch = new UnitOfWork();
        private readonly IWebHostEnvironment webHostEnvironment;
        private string imagePath = string.Empty;
        public ManageOfficeDocumentsController(IWebHostEnvironment hostEnvironment, ILogger<ManageOfficeDocumentsController> logger)
        {
            this.webHostEnvironment = hostEnvironment;
            _logger = logger;
        }
        [Authorize]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetAllOfficeDocuments()
        {
            try
            {
                var officeD = UnitOfWork.OfficeDocDetailsRepository.Get(null, x => x.OrderByDescending(id => id.OfficeDocId));
                if (officeD.Count() > 0)
                {
                    List<DocumentType> documents = UnitOfWork.DocumentTypeRepository.Get(x => x.IsActive == 1 && x.DocumentCategoryID == 2).ToList();

                    List<OfficeDocDetails> officeDocs = UnitOfWork.OfficeDocDetailsRepository.Get(null).ToList();


                    var data = from od in officeDocs
                               where od.DocumentId != 0
                               join d in documents
                               on od.DocumentId equals d.DocumentId into eGroup
                               where od.DocumentId.ToString() != string.Empty
                               from d in eGroup.DefaultIfEmpty()
                               select new
                               {
                                   OfficeDocId = od.OfficeDocId,
                                   DocumentName = d.DocumentName,
                                   DocumentId = od.DocumentId,
                                   DocIssueDate = od.DocIssueDate,
                                   DocExpiryDate = od.DocExpiryDate,
                                   OfficeDocDesc = od.OfficeDocDesc,
                                   IsActive = od.IsActive,
                               };




                    return Json(data);
                }
                else
                {
                    return Json(officeD);
                }
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.ToString());
                return null;
            }

        }
        [HttpGet]
        public JsonResult IsDocumentExists(OfficeDocDetails obj)
        {
            try
            {
                var docs = UnitOfWork.OfficeDocDetailsRepository.Get();
                bool has = docs.ToList().Any(x => x.DocumentId == obj.DocumentId);
                if (has)
                {
                    return Json(new { value = true, responseText = "Document name exists" });
                }
                else
                {
                    return Json(new { value = false, responseText = "Document name is not exists" });
                }
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.ToString());
                return Json(new { value = true, responseText = "Document name exists" });

            }

        }

        [HttpGet]
        public JsonResult GetIsExpiryEnabled(OfficeDocDetails obj)
        {
            try
            {
                var docs = UnitOfWork.DocumentTypeRepository.Get(d=>d.DocumentId==obj.DocumentId);
                bool has = docs.ToList().Any(x => x.IsExpiryRequired == 1);
                if (has)
                {
                    return Json(new { value = true });
                }
                else
                {
                    return Json(new { value = false});
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                return Json(new { value = false});

            }

        }

        [HttpGet]
        public JsonResult GetDocuments()
        {
            try
            {
                var docuements = UnitOfWork.DocumentTypeRepository.Get(x => x.IsActive == 1 && x.DocumentCategoryID == 2).ToList().OrderBy(o => o.DocumentName);
                //foreach (var item in companies)
                //{
                //    item.CompanyName = item.CompanyName + '-' + item.CompanyLocation;
                //}

                return Json(docuements);

            }
            catch(Exception ex)
            {
                _logger.LogError(ex.ToString());
                return null;
            }
        }

        [HttpPost]
        public JsonResult SubmitRequest(OfficeDocDetailsViewModel obj)
        {
            try
            {
                DateTime? expiry = null;
                if(obj.DocExpiryDate == DateTime.MinValue) { expiry = null; } else { expiry = obj.DocExpiryDate; }
            
                var officeDoc = new OfficeDocDetails()
                {
                    DocumentId = obj.DocumentId,
                    OfficeDocDesc = obj.OfficeDocDesc,
                    DocIssueDate = obj.DocIssueDate,
                    DocExpiryDate = expiry,
                    IsActive = obj.IsActive,
                    CreatedBy = Convert.ToInt32(TempData.Peek("UserId")),
                    CreatedDate = DateTime.Now
                };

                UnitOfWork.OfficeDocDetailsRepository.Insert(officeDoc);
                UnitOfWork.Save();


                var uploadedData = UnitOfWork.OfficeDocsFileUploadsRepository.Get(f => f.IsValid == 0 && f.DocumentId==obj.DocumentId);
                foreach (var item in uploadedData)
                {
                    item.IsValid = 1;
                    item.ModifiedBy = Convert.ToInt32(TempData.Peek("UserId"));
                    item.ModifiedDate = DateTime.Now;
                    UnitOfWork.OfficeDocsFileUploadsRepository.Update(item);
                    UnitOfWork.Save();
                }


                return Json(new { success = true, responseText = "Document added successfully." });
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.ToString());
                return Json(new { success = false, responseText = "Something went wrong." });
            }
        }
        [HttpPost]
        public JsonResult UpdateRequest(OfficeDocDetailsViewModel obj)
        {
            try
            {
                DateTime? expiry = null;
                if (obj.DocExpiryDate == DateTime.MinValue) { expiry = null; } else { expiry = obj.DocExpiryDate; }
                var fetchedDocs = objUnitOfWorkFetch.OfficeDocDetailsRepository.Get(x => x.OfficeDocId == obj.OfficeDocId).ToList();
                var officeDoc = new OfficeDocDetails()
                {
                    OfficeDocId = obj.OfficeDocId,
                    DocumentId = obj.DocumentId,
                    OfficeDocDesc = obj.OfficeDocDesc,
                    DocIssueDate = obj.DocIssueDate,
                    DocExpiryDate = expiry,
                    IsActive = obj.IsActive,
                    CreatedBy = fetchedDocs[0].CreatedBy,
                    CreatedDate = fetchedDocs[0].CreatedDate,
                    ModifiedBy = Convert.ToInt32(TempData.Peek("UserId")),
                    ModifiedDate = DateTime.Now
                };

                UnitOfWork.OfficeDocDetailsRepository.Update(officeDoc);
                UnitOfWork.Save();
                return Json(new { success = true, responseText = "Document Updated successfully." });
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.ToString());
                return Json(new { success = false, responseText = "Something went wrong." });
            }
        }
        [HttpPost]
        public async Task<IActionResult> UploadDocuments(IList<IFormFile> files, string docId)
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

                        using (FileStream output = System.IO.File.Create(this.GetPathAndFilename(filename)))
                            await source.CopyToAsync(output);

                        var fileDetails = new OfficeDocsFileUploads()
                        {
                            DocumentId = Convert.ToInt32(docId),
                            IsActive = 1,
                            CreatedBy = Convert.ToInt32(TempData.Peek("UserId")),
                            CreatedDate = DateTime.Now,
                            IsValid = 0,
                            ActualFileName = actualFileName,
                            FileName = filename,
                            FileLocation = GetFullDocumentPathWithoutFileName()
                        };


                        UnitOfWork.OfficeDocsFileUploadsRepository.Insert(fileDetails);
                        UnitOfWork.Save();
                    }
                return Json(new { success = true, responseText = "Office documents updated successfully.", docFileName = imagePath, imageFullPath = this.GetFullImagePathAndFilename(filename) });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
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
                _logger.LogError(ex.ToString());
                return null;
            }
        }
        private string GetPathAndFilename(string filename)
        {
            try
            {
                return this.webHostEnvironment.WebRootPath + "\\Uploads\\CompanyUploads\\" + filename;
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.ToString());
                return null;
            }
        }
        private string GetFullDocumentPathWithoutFileName()
        {
            try
            {
                return "\\Uploads\\CompanyUploads\\";
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.ToString());
                return null;
            }
        }
        private string GetFullImagePathAndFilename(string filename)
        {
            try
            {
                return "\\Uploads\\EmployeeUploads\\" + filename;
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.ToString());
                return null;
            }
        }
        [HttpGet]
        public JsonResult DeleteInValidDocUploads(int userID)
        {
            try
            {

                var uploadedData = UnitOfWork.OfficeDocsFileUploadsRepository.Get(f => f.IsValid == 0 && f.CreatedBy == userID );
                foreach (var item in uploadedData)
                {
                    UnitOfWork.OfficeDocsFileUploadsRepository.Delete(item.DocFileUploadId);
                    UnitOfWork.Save();
                }

                return Json(new { success = true, responseText = "success" });


            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                return Json(new { success = false, responseText = "Something went wrong. Please try again !" });

            }
        }

        [HttpGet]
        public JsonResult GetAllUploads(int docId)
        {
            try
            {
                List<DocumentType> documents = UnitOfWork.DocumentTypeRepository.Get(x => x.IsActive == 1).ToList();
                List<OfficeDocsFileUploads> files = UnitOfWork.OfficeDocsFileUploadsRepository.Get(x => x.IsActive == 1 && x.DocumentId == docId).ToList();
                var data = from d in documents
                           join f in files
                           on d.DocumentId equals f.DocumentId into eGroup
                           where d.DocumentCategoryID == 2 && d.DocumentId == docId
                           from f in eGroup.DefaultIfEmpty()
                           select new
                           {
                               FileName = f == null ? "No Files" : f.ActualFileName,
                               FilePath = f == null ? "No Path" : f.FileLocation + f.FileName,
                               DocumentName = d.DocumentName,
                               DocumentId = d.DocumentId,
                               isExpiryRequired = d.IsExpiryRequired,
                               isMandatory = d == null ? 0 : d.IsMandatory
                           };

                return Json(data);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.ToString());
                return null;
            }
        }
    }
}