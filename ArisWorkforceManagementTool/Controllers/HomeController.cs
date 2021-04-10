using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ArisWorkforceManagementTool.Models;
using Aris.Data;
using Aris.Data.Entities;

namespace ArisWorkforceManagementTool.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        UnitOfWork UnitOfWork = new UnitOfWork();

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
           // var user = new Users() { UserName = "Deepak",UserTypeID=1,CreatedDate=DateTime.Now };
           // UnitOfWork.UserRepository.Insert(user);
           // UnitOfWork.Save();

            var data = UnitOfWork.UserRepository.Get();
            return View();
        }

        public IActionResult Login()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
