using Aris.Models.ViewModel;

using System;
using System.Collections.Generic;
using System.Text;

namespace Aris.Models
{
    public static class EmailTemplateHelper
    {
        public const string createAccount = @"
                    <body>  
                        <div>
                            <p>Dear <span style=""font - weight: bold; "">[USER]</span>,</p>
                            </div>
                            <div>
                            <p>A user account has been created for you in AMT web application.Please refer the details below to login.</p>
                            <p><table style = ""text-align:left;"">
                            <tr><th>User Name </th> <td>: [USERNAME] </td></tr>
                            <tr><th>Password </th> <td>: [PASSWORD]</td>
                            </tr><tr><th>Application Link </th><td>: [APPLICATIONLINK]</td></tr></table></p >
                        </div>
                        <div>
                            <table style= ""font-weight: bold;"">
                                <tr><td rowspan = ""2""></td><td>Regards </td></tr>
                                <tr><td>AMT Admin </td></tr>
                            </table>
                        </div>
                    </body>";
        public const string submitEmployeeDetails = @"
                    <body>  
                        <div>
                            <p>Dear <span style=""font - weight: bold; "">[USER]</span>,</p>
                            </div>
                            <div>
                            <p>Employee details have been submitted by [LOGGEDINUSER] for your approval. Please review the details and confirm your action on the same.</p>
                            <p><table style = ""text-align:left;"">
                            <tr><th>Employee ID </th> <td>: Aris-[EMPID] </td></tr>
                            <tr><th>Employee Name </th> <td>: [EMPNAME]</td>
                            <tr><th>Passport Number</th> <td>: [PASSPORTNO]</td>
                            <tr><th>Resident Number</th> <td>: [RESIDENTNO]</td>
                            <tr><th>Passport Expiry </th> <td>: [PASSPORTEXPIRY]</td>
                            <tr><th>Resident Expiry</th> <td>: [RESIDENTEXPIRY]</td>
                            <tr><th>GSM </th> <td>: [GSMNO]</td>
                            <tr><th>Remarks </th> <td>: [REMARKS]</td>
                            </tr><tr><th>Application Link </th><td>: [APPLICATIONLINK]</td></tr></table></p >
                        </div>
                        <div>
                            <table style= ""font-weight: bold;"">
                                <tr><td rowspan = ""2""></td><td>Regards </td></tr>
                                <tr><td>AMT Admin </td></tr>
                            </table>
                        </div>
                    </body>";
        public const string sendBackEmployeeDetails = @"
                    <body>  
                        <div>
                            <p>Dear <span style=""font - weight: bold; "">[USER]</span>,</p>
                            </div>
                            <div>
                            <p>Employee details have been send back by [LOGGEDINUSER]. Please find the remarks below.</p>
                            <p><table style = ""text-align:left;"">
                            <tr><th>Employee ID </th> <td>: Aris-[EMPID] </td></tr>
                            <tr><th>Employee Name </th> <td>: [EMPNAME]</td>
                            <tr><th>Remarks </th> <td>: [REMARKS]</td>
                            </tr><tr><th>Application Link </th><td>: [APPLICATIONLINK]</td></tr></table></p >
                        </div>
                        <div>
                            <table style= ""font-weight: bold;"">
                                <tr><td rowspan = ""2""></td><td>Regards </td></tr>
                                <tr><td>AMT Admin </td></tr>
                            </table>
                        </div>
                    </body>";
        public const string reSubmitEmployeeDetails = @"
                    <body>  
                        <div>
                            <p>Dear <span style=""font - weight: bold; "">[USER]</span>,</p>
                            </div>
                            <div>
                            <p>Employee details have been re-submitted by [LOGGEDINUSER] for your approval. Please review the details and confirm your action on the same.</p>
                            <p><table style = ""text-align:left;"">
                            <tr><th>Employee ID </th> <td>: Aris-[EMPID] </td></tr>
                            <tr><th>Employee Name </th> <td>: [EMPNAME]</td>
                            <tr><th>Passport Number</th> <td>: [PASSPORTNO]</td>
                            <tr><th>Resident Number</th> <td>: [RESIDENTNO]</td>
                            <tr><th>Passport Expiry </th> <td>: [PASSPORTEXPIRY]</td>
                            <tr><th>Resident Expiry</th> <td>: [RESIDENTEXPIRY]</td>
                            <tr><th>GSM </th> <td>: [GSMNO]</td>
                            <tr><th>Remarks </th> <td>: [REMARKS]</td>
                            </tr><tr><th>Application Link </th><td>: [APPLICATIONLINK]</td></tr></table></p >
                        </div>
                        <div>
                            <table style= ""font-weight: bold;"">
                                <tr><td rowspan = ""2""></td><td>Regards </td></tr>
                                <tr><td>AMT Admin </td></tr>
                            </table>
                        </div>
                    </body>";
        public const string approvedEmployeeDetails = @"
                    <body>  
                        <div>
                            <p>Dear <span style=""font - weight: bold; "">All</span>,</p>
                            </div>
                            <div>
                            <p>Employee details have been approved by [LOGGEDINUSER]. Please find the details below.</p>
                            <p><table style = ""text-align:left;"">
                            <tr><th>Employee ID </th> <td>: Aris-[EMPID] </td></tr>
                            <tr><th>Employee Name </th> <td>: [EMPNAME]</td>
                            <tr><th>Passport Number</th> <td>: [PASSPORTNO]</td>
                            <tr><th>Resident Number</th> <td>: [RESIDENTNO]</td>
                            <tr><th>Passport Expiry </th> <td>: [PASSPORTEXPIRY]</td>
                            <tr><th>Resident Expiry</th> <td>: [RESIDENTEXPIRY]</td>
                            <tr><th>GSM </th> <td>: [GSMNO]</td>
                            <tr><th>Remarks </th> <td>: [REMARKS]</td>
                            </tr><tr><th>Application Link </th><td>: [APPLICATIONLINK]</td></tr></table></p >
                        </div>
                        <div>
                            <table style= ""font-weight: bold;"">
                                <tr><td rowspan = ""2""></td><td>Regards </td></tr>
                                <tr><td>AMT Admin </td></tr>
                            </table>
                        </div>
                    </body>";


        public static string OfficeDocumentDetails(IEnumerable<OfficeDocDetailsViewModel> officeDocumentDetails)
        {
            StringBuilder email = new StringBuilder(@"               
                    <body>  
                        <div>
                            <p>Dear <span style=""font - weight: bold; "">All</span>,</p>
                            </div>
                            <div>
                            <p>Please find the list of documents going to expire soon or expired.</p>
                            <p><table style = ""text-align:left;"">
                            <tr><th>Document Name</th>
                            <th>Isuue Date </th>
                            <th>Expiry Date</th></tr>");
            foreach (var document in officeDocumentDetails)
            {
                DateTime? dateOrNull = document.DocExpiryDate;
                DateTime expDate = DateTime.MaxValue;

                if (dateOrNull != null)
                {
                    expDate = dateOrNull.Value;
                }
                email.Append("<tr><td>" + document.DocumentName + "</td><td>" + document.DocIssueDate.ToString("dd/MM/yyyy") + "</td><td>" + expDate.ToString("dd/MM/yyyy") + "</td>");
            };

            email.Append(@"<tr><th>Application Link</th><td>: [APPLICATIONLINK]</td></tr></table></p>
                          </div >
                          <div>
                          <table style = ""font - weight: bold; "">
                          <tr><td rowspan = ""2""></td><td> Regards </td></tr>
                          <tr><td> AMT Admin </td></tr>
                          </table>
                          </div>
                          </body>");
            return email.ToString();
        }

        public static string CompanyDocumentDetails(IEnumerable<CompanyViewModel> companies)
        {
            StringBuilder email = new StringBuilder(@"               
                    <body>  
                        <div>
                            <p>Dear <span style=""font - weight: bold; "">All</span>,</p>
                            </div>
                            <div>
                            <p>Please find the list of client related documents are going to expire soon or expired.</p>
                            <p><table style = ""text-align:left;"">
                            <tr><th>Company Name</th>
                            <th>Document Name </th>
                            <th>Expiry Date</th></tr>");
            foreach (var company in companies)
            {
                DateTime? dateOrNull = company.CompanyExpiry;
                DateTime expDate = DateTime.MaxValue;

                if (dateOrNull != null)
                {
                    expDate = dateOrNull.Value;
                }
                email.Append("<tr><td>" + company.CompanyName + "</td><td>" + company.DocumentName + "</td><td>" + expDate.ToString("dd/MM/yyyy") + "</td>");
            };

            email.Append(@"<tr><th>Application Link</th><td>: [APPLICATIONLINK]</td></tr></table></p>
                          </div >
                          <div>
                          <table style = ""font - weight: bold; "">
                          <tr><td rowspan = ""2""></td><td> Regards </td></tr>
                          <tr><td> AMT Admin </td></tr>
                          </table>
                          </div>
                          </body>");
            return email.ToString();
        }

        public static string UserDocumentDetails(IEnumerable<ExpiredDocuments> expiredDocuments)
        {
            StringBuilder email = new StringBuilder(@"               
                    <body>  
                        <div>
                            <p>Dear <span style=""font - weight: bold; "">All</span>,</p>
                            </div>
                            <div>
                            <p>Please find the list of documents are going to expire soon or expired.</p>
                            <p><table style = ""text-align:left;border-collapse:collapse;"">
                            <tr><th>Document Name</th>
                            <th>Employee Name </th>
                            <th>Expiry Date</th></tr>");
            foreach (var document in expiredDocuments)
            {
                email.Append("<tr><td>" + document.DocumentName + "</td><td>" + document.EmployeeName + "</td><td>" + document.ExpiryDate?.ToString("dd/MM/yyyy") + "</td>");
            };

            email.Append(@"<tr><th>Application Link</th><td>: [APPLICATIONLINK]</td></tr></table></p>
                          </div >
                          <div>
                          <table style = ""font - weight: bold; "">
                          <tr><td rowspan = ""2""></td><td> Regards </td></tr>
                          <tr><td> AMT Admin </td></tr>
                          </table>
                          </div>
                          </body>");
            return email.ToString();
        }


    }
}
