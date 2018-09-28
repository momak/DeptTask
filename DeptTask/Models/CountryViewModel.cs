using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DeptTask.Models
{
    public class CountryViewModel
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public int Count { get; set; }
        public int Locations { get; set; }
    }
}
