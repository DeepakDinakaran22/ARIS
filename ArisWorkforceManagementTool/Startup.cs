using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aris.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Aris.Common;

namespace ArisWorkforceManagementTool
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            ConnectionService.Set(configuration);
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie();
            services.AddControllersWithViews().AddRazorRuntimeCompilation();
            services.AddDbContext<ArisContext>(options => options.UseSqlServer(Configuration.GetConnectionString("ArisConnection")));
            services.Configure<AppSettings>(Configuration.GetSection("EmailSettings"));
            
        }



        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();


            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                   name: "MasterPages",
                   pattern: "{area:exists}/{controller=ManageOfficeDocuments}/{action=Index}/{id?}");
                endpoints.MapControllerRoute(
                    name: "MasterPages",
                    pattern: "{area:exists}/{controller=ManageEmployees}/{action=Index}/{id?}");
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
                endpoints.MapControllerRoute(
                    name: "Account",
                    pattern: "{area:exists}/{controller=Account}/{action=Login}/{id?}");
            });
        }
    }
}
