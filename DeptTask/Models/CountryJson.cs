using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DeptTask.Models
{
    public class CountryJson
    {
        public Meta meta { get; set; }
        public List<CountryResponse> results { get; set; }
    }
}
