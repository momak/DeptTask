using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace DeptTask.Models
{
    public class CountryResponse
    {
        [JsonProperty("name")]
        public string name { get; set; }
        public string code { get; set; }
        public int cities { get; set; }
        public int locations { get; set; }
        public int count { get; set; }
    }
}
