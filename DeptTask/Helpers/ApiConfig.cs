using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace DeptTask.Helpers
{
    public class ApiConfig
    {
        public string apiBase { get; set; }
        public string apiLocal { get; set; }
        public string apiParameters { get; set; }
        public string apiCountries { get; set; }
        public string apiCities { get; set; }
        public string apiLocations { get; set; }
    }
}
