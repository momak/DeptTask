using System;
using System.Collections.Generic;

namespace DeptTask.Models
{
    public partial class ApiLogger
    {
        public Guid Id { get; set; }
        public string RequestUrl { get; set; }
        public string ResponseContent { get; set; }
        public DateTime? RequestDate { get; set; }
        public DateTime? ResponseDate { get; set; }
    }
}
