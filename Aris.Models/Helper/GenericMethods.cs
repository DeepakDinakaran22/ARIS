using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;

namespace Aris.Models.Helper
{
    public class GenericMethods
    {
        public string ConvertToTitleCase(string str)
        {
            TextInfo myTI = new CultureInfo("en-US", false).TextInfo;

            if (str!=string.Empty)
            {
                str = myTI.ToTitleCase(str);
            }
            return str;
        }
        public string ConvertToSingleUpperCase(string str)
        {

            if (str != string.Empty)
            {
                str = str.First().ToString().ToUpper() + str.Substring(1);
            }
            return str;
        }
    }

}
