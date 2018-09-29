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

namespace DeptTask.Controllers
{
    public class HomeController : Controller
    {
        private readonly DeptTaskDBContext _context;
        private readonly IConfiguration _configuration;

        public HomeController(DeptTaskDBContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public IActionResult Index()
        {
            
            return View();
        }
        public IActionResult Country()
        {
            return View();
        }

        public IActionResult City()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Locations()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [HttpPost]
        public async Task<IActionResult> StoreCountries()
        {
            string apiBase = _configuration.GetSection("AppSettings").GetChildren().FirstOrDefault(x => x.Key == "apiBase")?.Value;
            string apiCountry = _configuration.GetSection("AppSettings").GetChildren().FirstOrDefault(x => x.Key == "apiCountries")?.Value;

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


                        }
                    }
                }
            }

            return View("Country");
        }

        [HttpPost]
        public async Task<IActionResult> StoreCities()
        {
            string apiBase = _configuration.GetSection("AppSettings").GetChildren().FirstOrDefault(x => x.Key == "apiBase")?.Value;
            string apiCity = _configuration.GetSection("AppSettings").GetChildren().FirstOrDefault(x => x.Key == "apiCities")?.Value;

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


                        }
                    }
                }
            }

            return View("City");
        }
    }
}
