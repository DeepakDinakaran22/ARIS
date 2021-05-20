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

namespace ArisWorkforceManagementTool.Areas.MasterPages.Controllers
{

    public class AccountController : Controller
    {
        UnitOfWork unitOfWork = new UnitOfWork();
        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(UserLoginModel userModel)
        {
            if (!ModelState.IsValid)
            {
                return View(userModel);
            }

            var user = unitOfWork.UserRepository.Get().Where(user => user.UserName == userModel.UserName).FirstOrDefault();
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

                return RedirectToAction(nameof(HomeController.Index), "Home");
            }
            else
            {
                ModelState.AddModelError("", "Invalid UserName or Password");
                return View();
            }
        }
       
        public async Task<IActionResult> Logout(string returnUrl = null)
        {
            await HttpContext.SignOutAsync(
                CookieAuthenticationDefaults.AuthenticationScheme);
            if (returnUrl != null)
            {
                return LocalRedirect(returnUrl);
            }
            else
            {
                return RedirectToAction("Login", "Account");
            }
        }

    }
}
