using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Aris.Data;
using Aris.Models;
using Aris.Models.ViewModel;
using ArisWorkforceManagementTool.Controllers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Aris.Common.Interfaces;
using Aris.Common;
using Microsoft.Extensions.Options;
using ArisWorkforceManagementTool.Models;
using System.Diagnostics;
using Microsoft.Extensions.Logging;
using Aris.Models.Helper;

namespace ArisWorkforceManagementTool.Areas.MasterPages.Controllers
{
    public class AccountController : Controller 
    {
        private readonly ILogger<HomeController> _logger;

        UnitOfWork unitOfWork = new UnitOfWork();
        private readonly AppSettings _appSettings;

        public AccountController(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
        }
        [HttpGet]
        public IActionResult Login()
        {
            try
            {
    
                return View();
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.ToString());
                return null;

            }
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(UserLoginModel userModel)
        {
            try
            {


                if (!ModelState.IsValid)
                {
                    return View(userModel);
                }

                var user = unitOfWork.UserRepository.Get().Where(user => user.UserName.ToLower() == userModel.UserName.ToLower()).FirstOrDefault();
                if (user != null &&
                    new AuthHelper().VerifyHashedPassword(user.Password, userModel.Password))
                {
                    var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, user.UserName.ToString()),
                                new Claim("FullName", user.FullName),
                                new Claim(ClaimTypes.Role, unitOfWork.UserTypeRepository.Get().Where(id=>id.UserTypeID==user.UserTypeID).FirstOrDefault().UserRole),
                            };

                    var claimsIdentity = new ClaimsIdentity(
                        claims, CookieAuthenticationDefaults.AuthenticationScheme);

                    var authProperties = new AuthenticationProperties
                    {
                        ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(20),
                        IsPersistent = userModel.RememberMe,
                    };

                    await HttpContext.SignInAsync(
                        CookieAuthenticationDefaults.AuthenticationScheme,
                        new ClaimsPrincipal(claimsIdentity),
                        authProperties);
                    SetLayoutValues(user);
                    return RedirectToAction(nameof(HomeController.Index), "Home");
                }
                else
                {
                    ModelState.AddModelError("CustomError", "Invalid UserName or Password");
                    return View();
                }
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.ToString());
                ModelState.AddModelError("CustomError", "Invalid UserName or Password");
                return View();
            }
        }
       [HttpPost]
        public async Task<IActionResult> Logout(string returnUrl = null)
        {
            try
            {
                await HttpContext.SignOutAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme);
                //if (returnUrl != null)
                //{
                //    return LocalRedirect(returnUrl);
                //}
                //else
                //{
                //    return RedirectToAction("Login", "Account");
                //}
                return RedirectToAction("Login", "Account");
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.ToString());
                return null;
            }
        }

        protected void SetLayoutValues(Aris.Data.Entities.Users user)
        {
            try
            {
                TempData["LoggedInUser"] = user.FullName;
                TempData["UserImage"] = user.UserImage;
                TempData["UserId"] = user.UserId;
                TempData["UserRole"] = user.UserTypeID;
                TempData["Visibility"] = user.UserTypeID==1?"none":"block";


            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
            }
        }
    }
}
