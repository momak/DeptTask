using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DeptTask.Helpers;
using DeptTask.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace DeptTask.Controllers
{
    [Route("api/DeptTask")]
    [ApiController]
    public class LoggerController : ControllerBase
    {
        private readonly DeptTaskDBContext _context;
        private readonly IOptions<ApiConfig> _apiConfig;

        public LoggerController(DeptTaskDBContext context, IOptions<ApiConfig> apiConfig)
        {
            _context = context;
            _apiConfig = apiConfig;
        }

        // GET: api/DeptTask/GetCities
        /// <summary>
        /// Get all cities from the local DB
        /// </summary>
        /// <returns>List of Cities objects</returns>
        [HttpGet]
        [Route("GetCities")]
        public async Task<IActionResult> GetCities()
        {
            using (_context)
            {
                try
                {
                    var dbResponse = await _context.City.Select(c => new CityDTO()
                    {
                        IdCity = c.IdCity,
                        City = c.City1,
                        CountryCode = c.CountryCode
                    }).ToListAsync();

                    return Ok(dbResponse);
                }
                catch (Exception e)
                {
                    return BadRequest(e.Message);
                }
            }
        }

        // GET: api/DeptTask/GetCities/MK
        /// <summary>
        /// Get Cities from the local DB filtered by country code
        /// </summary>
        /// <param name="id">Country code</param>
        /// <returns>List of Cities objects</returns>
        [HttpGet]
        [Route("GetCitiesByCode")]
        public async Task<IActionResult> GetCities(string id)
        {
            using (_context)
            {
                try
                {
                    var dbResponse = await _context.City.Where(c => c.CountryCode == id)
                            .Select(c => new CityDTO()
                            {
                                IdCity = c.IdCity,
                                City = c.City1,
                                CountryCode = c.CountryCode
                            }).ToListAsync();

                    return Ok(dbResponse);
                }
                catch (Exception e)
                {
                    return BadRequest(e.Message);
                }
            }
        }

        // GET: api/DeptTask/GetCountries
        /// <summary>
        /// Get all countries from the local DB
        /// </summary>
        /// <returns>List of Country objects</returns>
        [HttpGet]
        [Route("GetCountries")]
        public async Task<IActionResult> GetCountries()
        {
            using (_context)
            {
                try
                {
                    var dbResponse = await _context.Country.Select(c => new CountryDTO()
                    {
                        Code = c.Code,
                        Name = c.Name
                    }).ToListAsync();

                    return Ok(dbResponse);
                }
                catch (Exception e)
                {
                    return BadRequest(e.Message);
                }
            }
        }

        // GET: api/DeptTask/GetCountries/MK
        /// <summary>
        /// Get Country from the local DB filtered by country code
        /// </summary>
        /// <param name="id">Country code</param>
        /// <returns>List of Country objects</returns>
        [HttpGet]
        [Route("GetCountryByCode")]
        public async Task<IActionResult> GetCountries(string id)
        {
            using (_context)
            {
                try
                {
                    var dbResponse = await _context.Country
                        .Select(c => new CountryDTO()
                        {
                            Code = c.Code,
                            Name = c.Name
                        }).FirstOrDefaultAsync(c => c.Code == id);

                    return Ok(dbResponse);
                }
                catch (Exception e)
                {
                    return BadRequest(e.Message);
                }
            }
        }

        // GET: api/DeptTask/Log
        /// <summary>
        /// Logs request to external api
        /// </summary>
        /// <param name="urlRequest">options to call external api as a url parameters</param>
        /// <returns>Response content from the external api call.
        /// if not older that 60 min then returns the most resent exact call, response content</returns>
        [HttpGet]
        [Route("Log")]
        public async Task<IActionResult> GetLog(string urlRequest)
        {
            ApiLogger apiLog = new ApiLogger();
            apiLog.Id = Guid.NewGuid();
            apiLog.RequestUrl = _apiConfig.Value.apiBase + urlRequest;
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
        /// <summary>
        /// Logs request to external api
        /// </summary>
        /// <param name="urlRequest">options to call external api as a url parameters</param>
        /// <returns>response from the external api</returns>
        [HttpPost]
        public async Task<IActionResult> RequestApiData([FromBody] string urlRequest)
        {
            ApiLogger apiLog = new ApiLogger();
            apiLog.Id = Guid.NewGuid();
            apiLog.RequestUrl = _apiConfig.Value.apiBase + urlRequest;
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
        
    }
}
