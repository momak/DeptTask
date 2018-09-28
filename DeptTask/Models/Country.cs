using System;
using System.Collections.Generic;

namespace DeptTask.Models
{
    public partial class Country
    {
        public Country()
        {
            City = new HashSet<City>();
        }

        public string Code { get; set; }
        public string Name { get; set; }
        public int? Count { get; set; }
        public int? Cities { get; set; }
        public int? Locations { get; set; }

        public ICollection<City> City { get; set; }
    }
}
