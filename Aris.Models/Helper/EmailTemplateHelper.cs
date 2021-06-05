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
    }
}
