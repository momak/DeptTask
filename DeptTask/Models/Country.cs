using System;
using System.Collections.Generic;

namespace DeptTask.Models
{
    public partial class Country
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public int? Count { get; set; }
        public int? Cities { get; set; }
        public int? Locations { get; set; }
    }
}
