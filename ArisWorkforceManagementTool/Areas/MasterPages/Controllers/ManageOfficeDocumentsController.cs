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
    public class ManageOfficeDocumentsController : Controller
    {
        private readonly ILogger<ManageUsersController> _logger;
        UnitOfWork UnitOfWork = new UnitOfWork();
        UnitOfWork objUnitOfWorkFetch = new UnitOfWork();

        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetAllOfficeDocuments()
        {
            var officeD = UnitOfWork.OfficeDocDetailsRepository.Get(null, x => x.OrderByDescending(id => id.OfficeDocId));
            if (officeD.Count() > 0)
            {
                List<DocumentType> documents = UnitOfWork.DocumentTypeRepository.Get(x => x.IsActive == 1&&x.DocumentCategoryID==2).ToList();

                List<OfficeDocDetails> officeDocs = UnitOfWork.OfficeDocDetailsRepository.Get(null).ToList();

               
                var data = from od in officeDocs where od.DocumentId != 0
                           join d in documents
                           on od.DocumentId equals d.DocumentId  into eGroup
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
        [HttpGet]
        public JsonResult IsDocumentExists(OfficeDocDetails obj)
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

        [HttpGet]
        public JsonResult GetDocuments()
        {
            var docuements = UnitOfWork.DocumentTypeRepository.Get(x => x.IsActive == 1 && x.DocumentCategoryID==2 ).ToList().OrderBy(o => o.DocumentName);
            //foreach (var item in companies)
            //{
            //    item.CompanyName = item.CompanyName + '-' + item.CompanyLocation;
            //}

            return Json(docuements);

        }

        [HttpPost]
        public JsonResult SubmitRequest(OfficeDocDetailsViewModel obj)
        {
            try
            {
                var officeDoc = new OfficeDocDetails()
                {
                    DocumentId = obj.DocumentId,
                    OfficeDocDesc = obj.OfficeDocDesc,
                    DocIssueDate = obj.DocIssueDate,
                    DocExpiryDate = obj.DocExpiryDate,
                    IsActive = obj.IsActive,
                    CreatedBy = 1,
                    CreatedDate = DateTime.Now
                };

                UnitOfWork.OfficeDocDetailsRepository.Insert(officeDoc);
                UnitOfWork.Save();
                return Json(new { success = true, responseText = "Document added successfully." });
            }
            catch
            {
                return Json(new { success = false, responseText = "Something went wrong." });
            }
        }
        [HttpPost]
        public JsonResult UpdateRequest(OfficeDocDetailsViewModel obj)
        {
            try
            {
                var fetchedDocs = objUnitOfWorkFetch.OfficeDocDetailsRepository.Get(x => x.OfficeDocId == obj.OfficeDocId).ToList();
                var officeDoc = new OfficeDocDetails()
                {
                    OfficeDocId = obj.OfficeDocId,
                    DocumentId = obj.DocumentId,
                    OfficeDocDesc = obj.OfficeDocDesc,
                    DocIssueDate = obj.DocIssueDate,
                    DocExpiryDate = obj.DocExpiryDate,
                    IsActive = obj.IsActive,
                    CreatedBy = fetchedDocs[0].CreatedBy,
                    CreatedDate = fetchedDocs[0].CreatedDate,
                    ModifiedBy = 1,
                    ModifiedDate = DateTime.Now
                };

                UnitOfWork.OfficeDocDetailsRepository.Update(officeDoc);
                UnitOfWork.Save();
                return Json(new { success = true, responseText = "Document Updated successfully." });
            }
            catch
            {
                return Json(new { success = false, responseText = "Something went wrong." });
            }
        }
    }
}