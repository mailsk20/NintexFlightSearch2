using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Threading.Tasks;

using NintexCommon;
using NintexApiClient;

namespace NintexFlightSearch.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<JsonResult> FlightSearchOne(FlightSearchModel model)
        {
            using (var apiClient = new ApiClient())
            {
                var httpContent = await apiClient.InvokeApi(String.Format("AirlineOne?DepartureAirportCode={0}&ArrivalAirportCode={1}&DepartureDate={2}&ReturnDate={3}", model.DepartureAirportCode, model.ArrivalAirportCode, model.DepartureDate, model.ReturnDate), HttpActionType.Get);
                var apiClientResponseCode = httpContent.Headers.GetValues("ApiClientResponseCode").FirstOrDefault();
                if (byte.Parse(apiClientResponseCode) == (byte)ApiClientResponseCode.Success)
                {
                    var result = await httpContent.ReadAsAsync<IEnumerable<SearchResultModel>>();
                    if (result == null) return Json(null, JsonRequestBehavior.AllowGet);
                    return Json(result, JsonRequestBehavior.AllowGet);
                }
                else
                    throw new Exception("NullContentRefException: No records found.");
            }
        }

        [HttpPost]
        public async Task<JsonResult> FlightSearchTwo(FlightSearchModel model)
        {
            using (var apiClient = new ApiClient())
            {
                var httpContent = await apiClient.InvokeApi("AirlineTwo", HttpActionType.Get);
                var apiClientResponseCode = httpContent.Headers.GetValues("ApiClientResponseCode").FirstOrDefault();
                if (byte.Parse(apiClientResponseCode) == (byte)ApiClientResponseCode.Success)
                {
                    var result = await httpContent.ReadAsAsync<SearchResultTwoModel>();
                    if (result == null) return Json(null, JsonRequestBehavior.AllowGet);
                    return Json(result.Results, JsonRequestBehavior.AllowGet);
                }
                else
                    throw new Exception("NullContentRefException: No records found.");
            }
        }
    }
}