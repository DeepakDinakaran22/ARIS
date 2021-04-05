using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ArisWorkforceManagementTool.Areas.MasterPages.Controllers
{
    [Area("MasterPages")]
    public class ManageOfficeDocumentsController : Controller
    {
        // GET: ManageOfficeDocuments
        public ActionResult Index()
        {
            return View();
        }

        // GET: ManageOfficeDocuments/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: ManageOfficeDocuments/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: ManageOfficeDocuments/Create
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

        // GET: ManageOfficeDocuments/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: ManageOfficeDocuments/Edit/5
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

        // GET: ManageOfficeDocuments/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: ManageOfficeDocuments/Delete/5
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
    }
}