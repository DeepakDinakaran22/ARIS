using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ArisWorkforceManagementTool.Areas.MasterPages.Controllers
{
    [Area("MasterPages")]
    public class ManageCompanyController : Controller
    {
        // GET: ManageCompany
        public ActionResult Index()
        {
            return View();
        }

        // GET: ManageCompany/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: ManageCompany/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: ManageCompany/Create
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

        // GET: ManageCompany/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: ManageCompany/Edit/5
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

        // GET: ManageCompany/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: ManageCompany/Delete/5
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