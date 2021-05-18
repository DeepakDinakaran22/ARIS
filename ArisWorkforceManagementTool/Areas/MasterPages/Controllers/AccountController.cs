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
                    //AllowRefresh = <bool>,
                    // Refreshing the authentication session should be allowed.

                    //ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(10),
                    // The time at which the authentication ticket expires. A 
                    // value set here overrides the ExpireTimeSpan option of 
                    // CookieAuthenticationOptions set with AddCookie.

                    //IsPersistent = true,
                    // Whether the authentication session is persisted across 
                    // multiple requests. When used with cookies, controls
                    // whether the cookie's lifetime is absolute (matching the
                    // lifetime of the authentication ticket) or session-based.

                    //IssuedUtc = <DateTimeOffset>,
                    // The time at which the authentication ticket was issued.

                    //RedirectUri = <string>
                    // The full path or absolute URI to be used as an http 
                    // redirect response value.
                };

                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity),
                    authProperties);
                //var identity = new ClaimsIdentity(IdentityConstants.ApplicationScheme);
                //identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()));
                //identity.AddClaim(new Claim(ClaimTypes.Name, user.UserName));

                //await HttpContext.SignInAsync(IdentityConstants.ApplicationScheme,
                //    new ClaimsPrincipal(identity));

                return RedirectToAction(nameof(HomeController.Index), "Home");
            }
            else
            {
                ModelState.AddModelError("", "Invalid UserName or Password");
                return View();
            }
        }

    }
}
