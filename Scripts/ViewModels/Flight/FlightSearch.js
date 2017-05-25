Nintex.FlightSearch = (function ($, kendo, App) {

    var vmFlightSearch = kendo.observable({      
        
        DepartureAirport: null,
        ArrivalAirport: null,
        DepartureDate: null,
        ReturnDate: null,

        IsRecordFound: false,
        FlightSearchData: [],

        SearchFlightClick: function () {
            if (Nintex.Validation.Validate.ValidateForm("FlightSearchForm")) {
                var data = {
                    DepartureAirportCode: vmFlightSearch.DepartureAirport,
                    ArrivalAirportCode: vmFlightSearch.ArrivalAirport,
                    DepartureDate: kendo.toString(kendo.parseDate(vmFlightSearch.DepartureDate, "dd-MMM-yyyy"), "dd/MM/yyyy"),
                    ReturnDate: kendo.toString(kendo.parseDate(vmFlightSearch.ReturnDate, "dd-MMM-yyyy"), "dd/MM/yyyy"),
                };

                ShowLoader();
                $.ajax({
                    type: "POST",
                    url: "/Home/FlightSearchOne",
                    dataType: "json",
                    data: JSON.stringify(data),
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        HideLoader();
                        vmFlightSearch.set("IsRecordFound", data.length > 0 ? true : false);
                        if (data.length > 0) {
                            var reportResult = new kendo.data.DataSource({ data: data, pageSize: 20 });
                            reportResult.read();
                            vmFlightSearch.set("FlightSearchData", reportResult);
                        }
                    },
                    error: function (err) {
                        HideLoader();
                        Nintex.Layout.viewModel.ShowError(err);
                    }
                });
            }
        },

        ClearFilterClick: function () {
            vmFlightSearch.set("DepartureAirport", null);
            vmFlightSearch.set("ArrivalAirport", null);
            vmFlightSearch.set("DepartureDate", null);
            vmFlightSearch.set("ReturnDate", null);
            Nintex.Validation.Validate.CleanValidationErrorForm("FlightSearchForm");
        },

    });

    $(function () {
        kendo.bind($("#FlightSearch"), vmFlightSearch);
    });

    return { viewModel: vmFlightSearch };
})(jQuery, kendo, Nintex);
