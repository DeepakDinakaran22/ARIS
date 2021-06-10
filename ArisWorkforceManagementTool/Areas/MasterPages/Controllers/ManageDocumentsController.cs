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


namespace ArisWorkforceManagementTool.Areas.MasterPages.Controllers
{
    [Area("MasterPages")]
    public class ManageDocumentsController : Controller
    {
        private readonly ILogger<ManageDocumentsController> _logger;
        UnitOfWork UnitOfWork = new UnitOfWork();
        UnitOfWork UnitOfWorkExists = new UnitOfWork();
        public ManageDocumentsController(ILogger<ManageDocumentsController> logger)
        {
            _logger = logger;
        }
        [Authorize]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetAllDocuments()
        {
            try
            {
                var companies = UnitOfWork.DocumentTypeRepository.Get(null, x => x.OrderByDescending(id => id.DocumentId));
                return Json(companies);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.ToString());
                return null;

            }

        }

        [HttpPost]
        public JsonResult SubmitRequest(DocumentTypeViewModel obj)
        {
            try
            {
                var doc = new DocumentType() { 
                    DocumentName= obj.DocumentName, 
                    DocumentDescription= obj.DocumentDescription,
                    IsActive = obj.IsActive, 
                    CreatedDate = DateTime.Now, 
                    CreatedBy = Convert.ToInt32(TempData.Peek("UserId")), 
                    DocumentCategoryID= obj.DocumentCategoryID,
                    IsExpiryRequired=obj.IsExpiryRequired,
                    IsMandatory=obj.IsMandatory

                };

                UnitOfWork.DocumentTypeRepository.Insert(doc);
                UnitOfWork.Save();

                return Json(new { success = true, responseText = "Document type added successfully." });
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.ToString());
                return Json(new { success = false, responseText = "Something went wrong." });
            }
        }

        [HttpPost]
        public JsonResult UpdateRequest(DocumentTypeViewModel obj)
        {
            try
            {
                var docExists = UnitOfWorkExists.DocumentTypeRepository.Get(x => x.DocumentId==obj.DocumentId).ToList();
                var doc = new DocumentType() {
                    DocumentId = obj.DocumentId,
                    DocumentName = obj.DocumentName,
                    DocumentDescription = obj.DocumentDescription,
                    IsActive = obj.IsActive,
                    CreatedDate = docExists[0].CreatedDate,
                    CreatedBy = docExists[0].CreatedBy,
                    ModifiedBy = Convert.ToInt32(TempData.Peek("UserId")),
                    ModifiedDate = DateTime.Now,
                    DocumentCategoryID = obj.DocumentCategoryID,
                    IsExpiryRequired=obj.IsExpiryRequired,
                    IsMandatory = obj.IsMandatory
                };
                UnitOfWork.DocumentTypeRepository.Update(doc);
                UnitOfWork.Save();

                return Json(new { success = true, responseText = "Document details updated successfully." });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                return Json(new { success = false, responseText = "Something went wrong." });
            }

        }
        [HttpGet]
        public JsonResult GetCategories()
        {
            try
            {
                var categories = UnitOfWork.DocumentCategoryRepository.Get(x => x.IsActive == 1).ToList().OrderBy(o => o.DocumentCategoryName);
                return Json(categories);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.ToString());
                return null;
            }

        }
        public JsonResult IsDocumentNameExists(DocumentTypeViewModel obj)
        {
            try
            {
                var documents = UnitOfWork.DocumentTypeRepository.Get();
                bool has = documents.ToList().Any(x => x.DocumentName.ToLower() == obj.DocumentName.ToLower() && x.DocumentCategoryID == obj.DocumentCategoryID);
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


    }
}