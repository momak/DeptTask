using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AspNetCore;
using DeptTask.Helpers;
using DeptTask.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;

namespace DeptTask.Controllers
{
    [Route("api/DeptTask")]
    [ApiController]
    public class LoggerController : ControllerBase
    {
        private readonly DeptTaskDBContext _context;
        private readonly IConfiguration _configuration;

        public LoggerController(DeptTaskDBContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GET: api/DeptTask
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/DeptTask/5
        [HttpGet]
        [Route("Log")]
        public async Task<IActionResult> GetLog(string urlRequest)
        {
            ApiLogger apiLog = new ApiLogger();
            apiLog.Id = Guid.NewGuid();
            apiLog.RequestUrl = _configuration.GetSection("AppSettings").GetChildren().FirstOrDefault(x => x.Key == "apiBase")?.Value + urlRequest;
            apiLog.RequestDate = DateTime.Now;

            using (_context)
            {
                try
                {
                    var dbResponse = _context.ApiLogger.Where(api =>
                        api.RequestUrl == apiLog.RequestUrl &&
                        api.ResponseDate >= DateTime.Now.AddMinutes(-60))
                        .OrderByDescending(api => api.ResponseDate)
                        .FirstOrDefault();

                    if (dbResponse != null)
                    {
                        return Ok(dbResponse.ResponseContent);
                    }

                    ApiCaller apiCaller = new ApiCaller();
                    apiLog.ResponseContent = await apiCaller.CallApi(apiLog.RequestUrl);
                    apiLog.ResponseDate = DateTime.Now;

                    await _context.ApiLogger.AddAsync(apiLog);
                    await _context.SaveChangesAsync();
                }
                catch (Exception e)
                {
                    return BadRequest(e.Message);
                }
            }

            return Ok(apiLog.ResponseContent);
        }

        // POST: api/DeptTask
        [HttpPost]
        public async Task<IActionResult> RequestApiData([FromBody] string urlRequest)
        {
            ApiLogger apiLog = new ApiLogger();
            apiLog.Id = Guid.NewGuid();
            apiLog.RequestUrl = urlRequest;
            apiLog.RequestDate = DateTime.Now;

            ApiCaller apiCaller = new ApiCaller();

            apiLog.ResponseContent = await apiCaller.CallApi(apiLog.RequestUrl);
            apiLog.ResponseDate = DateTime.Now;

            using (_context)
            {
                try
                {
                    await _context.ApiLogger.AddAsync(apiLog);
                    await _context.SaveChangesAsync();
                }
                catch (Exception e)
                {
                    return BadRequest(e.Message);
                }
            }

            return Ok(apiLog.ResponseContent);

        }

        // POST: api/DeptTask
        [HttpPost]
        public async Task<IActionResult> LogApi([FromBody] string urlRequest)
        {
            ApiLogger apiLog = new ApiLogger();
            apiLog.Id = Guid.NewGuid();
            apiLog.RequestUrl = urlRequest;
            apiLog.RequestDate = DateTime.Now;

            ApiCaller apiCaller = new ApiCaller();

            apiLog.ResponseContent = await apiCaller.CallApi(apiLog.RequestUrl);
            apiLog.ResponseDate = DateTime.Now;

            using (_context)
            {
                try
                {
                    await _context.ApiLogger.AddAsync(apiLog);
                    await _context.SaveChangesAsync();
                }
                catch (Exception e)
                {
                    return BadRequest(e.Message);
                }
            }
            return Ok();
        }
    }
}
