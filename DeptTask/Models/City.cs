using System;
using System.Collections.Generic;

namespace DeptTask.Models
{
    public partial class City
    {
        public string City1 { get; set; }
        public string CountryCode { get; set; }
        public int? Count { get; set; }
        public int? Locations { get; set; }

        public Country CountryCodeNavigation { get; set; }
    }
}
