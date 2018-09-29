using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DeptTask.Models
{
    public class CityJson
    {
        public Meta meta { get; set; }
        public List<CityResponse> results { get; set; }
    }
}
