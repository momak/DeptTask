using System;
using System.Diagnostics;
using System.Threading.Tasks;
using DeptTask.Helpers;
using Microsoft.AspNetCore.Mvc;
using DeptTask.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Linq;
using Microsoft.Extensions.Options;

namespace DeptTask.Controllers
{
    public class HomeController : Controller
    {
        private readonly DeptTaskDBContext _context;
        private readonly IOptions<ApiConfig> _apiConfig;

        public HomeController(DeptTaskDBContext context, IOptions<ApiConfig> apiConfig)
        {
            _context = context;
            _apiConfig = apiConfig;
        }

        public IActionResult Index()
        {
            ViewBag.serviceApi = _apiConfig.Value.apiBase;
            ViewBag.loggerApi = _apiConfig.Value.apiLocal;
            return View();
        }
        public IActionResult Country()
        {
            ViewBag.serviceApi = _apiConfig.Value.apiBase;
            ViewBag.loggerApi = _apiConfig.Value.apiLocal;
            return View();
        }

        public IActionResult City()
        {
            ViewBag.serviceApi = _apiConfig.Value.apiBase;
            ViewBag.loggerApi = _apiConfig.Value.apiLocal;
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        /// <summary>
        /// External not Logged Api Call to get countries available and store them in local database (diferential). 
        /// </summary>
        /// <returns>Status of the operation</returns>
        [HttpPost]
        public async Task<IActionResult> StoreCountries()
        {
            string apiBase = _apiConfig.Value.apiBase;
            string apiCountry = _apiConfig.Value.apiCountries;

            ApiCaller apiCall = new ApiCaller();
            var response = await apiCall.CallApi(apiBase, apiCountry);

            if (!string.IsNullOrEmpty(response))
            {
                //Deserializing the response recieved from web api and storing  
                CountryJson countryJson = JsonConvert.DeserializeObject<CountryJson>(response);
                if (countryJson.results.Any())
                {
                    using (_context)
                    {
                        try
                        {
                            foreach (CountryResponse result in countryJson.results)
                            {
                                if (await _context.Country.FirstOrDefaultAsync(c => c.Code == result.code) == null)
                                {
                                    await _context.Country.AddAsync(new Country
                                    {
                                        Code = result.code,
                                        Name = result.name,
                                        Cities = result.cities,
                                        Count = result.count,
                                        Locations = result.locations
                                    });
                                }
                            }

                            await _context.SaveChangesAsync();
                        }
                        catch (Exception e)
                        {//log exception
                            return BadRequest(e.Message);
                        }
                    }
                }
            }

            return Ok(true);
        }

        /// <summary>
        /// External not Logged Api Call to get cities available and store them in local database (diferential). 
        /// </summary>
        /// <returns>Status of the operation</returns>
        [HttpPost]
        public async Task<IActionResult> StoreCities()
        {
            string apiBase = _apiConfig.Value.apiBase;
            string apiCity = _apiConfig.Value.apiCities;

            //there are under 10,000 cities in the DB.
            //this is the max records per request
            //it should be implemented as a paging with multuple calls to api
            apiCity += "?limit=10000";
            
            ApiCaller apiCall = new ApiCaller();
            var response = await apiCall.CallApi(apiBase, apiCity);

            if (!string.IsNullOrEmpty(response))
            {
                //Deserializing the response recieved from web api and storing  
                CityJson cityJson = JsonConvert.DeserializeObject<CityJson>(response);
                if (cityJson.results.Any())
                {
                    using (_context)
                    {
                        try
                        {
                            foreach (CityResponse result in cityJson.results)
                            {
                                if (await _context.City.FirstOrDefaultAsync(c => c.CountryCode == result.country && c.City1==result.city) == null)
                                {
                                    await _context.City.AddAsync(new City
                                    {
                                        City1 = result.city,
                                        CountryCode = result.country,
                                        Count = result.count,
                                        Locations = result.locations
                                    });
                                }
                            }

                            await _context.SaveChangesAsync();
                        }
                        catch (Exception e)
                        {//log exception
                           return BadRequest(e.Message);
                        }
                    }
                }
            }
            return Ok(true);
        }
    }
}
