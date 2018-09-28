using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DeptTask.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace DeptTask.Controllers
{
    public class HomeController : Controller
    {
        private readonly DeptTaskDBContext _context;

        public HomeController(DeptTaskDBContext context)
        {
            _context = context;
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
            string apiBase = "https://api.openaq.org/v1/";
            string apiCountries = "countries";

            using (var client = new HttpClient())
            {
                //Passing service base url  
                client.BaseAddress = new Uri(apiBase);

                client.DefaultRequestHeaders.Clear();
                //Define request data format  
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                HttpResponseMessage Res = await client.GetAsync(apiCountries);

                //Checking the response is successful or not which is sent using HttpClient  
                if (Res.IsSuccessStatusCode)
                {
                    //Storing the response details recieved from web api   
                    var jsonResult = Res.Content.ReadAsStringAsync().Result;

                    //Deserializing the response recieved from web api and storing into the Employee list  
                    CountryJson countryJson = JsonConvert.DeserializeObject<CountryJson>(jsonResult);

                    if (countryJson.results.Any())
                    {
                        using (_context)
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

                    }

                }
            }

            return View("Country");

        }
    }
}
