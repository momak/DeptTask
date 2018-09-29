using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using DeptTask.Models;
using Newtonsoft.Json;

namespace DeptTask.Helpers
{
    public class ApiCaller
    {
        public async Task<string> CallApi(string apiBase, string apiDetails)
        {
            using (var client = new HttpClient())
            {
                //Passing service base url  
                client.BaseAddress = new Uri(apiBase);

                client.DefaultRequestHeaders.Clear();
                //Define request data format  
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                HttpResponseMessage response = await client.GetAsync(apiDetails);

                //Checking the response is successful or not which is sent using HttpClient  
                if (response.IsSuccessStatusCode)
                {
                    //Storing the response details recieved from web api   
                    var jsonResult =response.Content.ReadAsStringAsync().Result;

                    return jsonResult;
                    
                }

                return String.Empty;
            }
        }

        public async Task<string> CallApi(string apiBaseUrl)
        {
            using (var client = new HttpClient())
            {
                //Passing service base url  
                //client.BaseAddress = new Uri(apiBaseUrl);

                client.DefaultRequestHeaders.Clear();
                //Define request data format  
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                HttpResponseMessage response = await client.GetAsync(apiBaseUrl);

                //Checking the response is successful or not which is sent using HttpClient  
                if (response.IsSuccessStatusCode)
                {
                    //Storing the response details recieved from web api   
                    var jsonResult = response.Content.ReadAsStringAsync().Result;

                    return jsonResult;

                }

                return String.Empty;
            }
        }

    }
}
