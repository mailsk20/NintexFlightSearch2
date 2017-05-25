Nintex.Layout = (function ($, kendo, App) {

    var vmLayout = kendo.observable({

        ApiPath: "/",

        MessageType: {
            Alert: "alert",
            Info: "info",
            Success: "success",
            Error: "error"
        },

        GetApiUrl: function (methodName) {
            return vmLayout.ApiPath + methodName;

        },

        ConfirmDialog: function (options) {
            var config, element;

            config = $.extend({
                message: '',
                messageTitle: 'Warning',
                okButtonTitle: 'OK',
                cancelButtonTitle: 'Cancel',
                title: 'Confirmation',
                buttons: ['OK', 'Cancel']
            }, options);

            //element = $("<div style='border:4px solid #cdcdcd; width:600px; height:212px; padding:25px'>"
            //    + "<div style='border-bottom:3px solid #cccccc; padding-bottom:10px; font-size:20px; color:#333333; margin-bottom:20px; font-weight:bold'>" + config.messageTitle + "</div>"
            //    + "<div style='color: darkgray;'>" + config.message + "</div>"
            //    + "<div style='margin-left:25%'><div class='button' data-buttonname='Cancel' style='color:#ffffff;background-color:#999999;margin:20px;padding: 10px 16px;float:left;border-radius:5px;cursor:pointer;'>" + config.cancelButtonTitle + "</div>"
            //    + "<div class='button' data-buttonname='OK' style='color:#ffffff;background-color:#99cc00;margin:20px;padding: 10px 16px;float:left;border-radius:5px;cursor:pointer;i'>" + config.okButtonTitle + "</div></div></div>");

            element = $("<div class='box box-primary'>"
                    + "<div class='box-header with-border'><h3 class='box-title'>" + config.messageTitle + "</h3></div>"
                    + "<div class='box-body box-body-message'>"
                        + "<div class='col-sm-2 rm-padding'><img src='../../Images/Icons/question.jpg' /></div>"
                        + "<div class='col-sm-10 rm-padding'>" + config.message + "</div>"
                    + "</div>"
                    + "<div class='box-footer text-center'>"
                    + "<button type='button' class='btn btn-primary btn-popup button' data-buttonname='OK'>" + config.okButtonTitle + "</button>"
                    + "<button type='button' class='btn btn-default btn-popup button' data-buttonname='Cancel'>" + config.cancelButtonTitle + "</button>"
                    + "</div>"
                    + "</div>");


            element.kendoWindow({
                title: false,
                modal: true,
                open: function (e) {
                    var me = this;
                    me.element
                        .find('.button')
                        .click(function (e) {
                            me.clickedButton = $(e.target).data("buttonname");
                            me.close();
                        });
                },
                close: function (e) {
                    if (_.isFunction(config.close)) {
                        config.close({ button: this.clickedButton });
                    }
                },
                deactivate: function () {
                    this.destroy();
                },
                actions: ["Close"],
                width: "450px",
                height: "auto",
            }).getKendoWindow().center().open();
        },

        AlertConfirmDialog: function (options) {
            var config, element;

            config = $.extend({
                message: '',
                messageTitle: 'Message',
                okButtonTitle: 'OK',
                //cancelButtonTitle: 'Cancel',
                title: 'Confirmation',
                buttons: ['OK']
            }, options);

            element = $("<div class='box box-primary'>"
                   + "<div class='box-header with-border'><h3 class='box-title'>" + config.messageTitle + "</h3></div>"
                   + "<div class='box-body box-body-message'>"
                        + "<div class='col-sm-2 rm-padding'><img src='../../Images/Icons/success.png' /></div>"
                        + "<div class='col-sm-10 rm-padding'>" + config.message + "</div>"
                   + "</div>"
                   + "<div class='box-footer text-center'>"
                   + "<button type='button' class='btn btn-primary btn-popup button' data-buttonname='OK'>" + config.okButtonTitle + "</button>"
                   //+ "<button type='button' class='btn btn-default btn-popup button' data-buttonname='Cancel'>" + config.cancelButtonTitle + "</button>"
                   + "</div>"
                   + "</div>");

            element.kendoWindow({
                title: false,
                modal: true,
                open: function (e) {
                    var me = this;
                    me.element
                        .find('.button')
                        .click(function (e) {
                            me.clickedButton = $(e.target).data("buttonname");
                            me.close();
                        });
                },
                close: function (e) {
                    if (_.isFunction(config.close)) {
                        config.close({ button: this.clickedButton });
                    }
                },
                deactivate: function () {
                    this.destroy();
                },
                actions: ["Close"],
                width: "450px",
                height: "auto",
            }).getKendoWindow().center().open();
        },

        AlertDialog: function (options) {
            var config, element;

            config = $.extend({
                message: '',
                messageTitle: '',
                messageType: '',
                okButtonTitle: '',
                //cancelButtonTitle: 'Cancel',
                title: 'Confirmation',
                buttons: ['OK']
            }, options);

            //element = $("<div style='border:4px solid #cdcdcd; width:450px; height:auto; padding:10px'>"
            //    + "<div style='border-bottom:3px solid #cccccc; padding-bottom:10px; font-size:20px; color:#333333; margin-bottom:20px; font-weight:bold'>" + config.messageTitle + "</div>"
            //    + "<div style='margin:10px;min-height: 30px;height: auto;line-height: 20px;' >" + config.message + "</div>"
            //    + "<div style='margin-left:36%'>"
            //    + "<div class='button' data-buttonname='OK' style='color:#ffffff;background-color:#99cc00;margin:10px;padding: 10px 16px;float:left;border-radius:5px;cursor:pointer;min-width:70px;text-align:center;'>" + config.okButtonTitle + "</div></div></div>");

            var imgurl = "";
            switch (config.messageType) {
                case vmLayout.MessageType.Alert: imgurl = "../../Images/Icons/alert.png"; break;
                case vmLayout.MessageType.Info: imgurl = "../../Images/Icons/info.png"; break;
                case vmLayout.MessageType.Success: imgurl = "../../Images/Icons/success.png"; break;
                case vmLayout.MessageType.Error: imgurl = "../../Images/Icons/error.png"; break;
                default: imgurl = "../../Images/Icons/alert.png";
            }

            element = $("<div class='box box-primary'>"
                    + "<div class='box-header with-border'><h3 class='box-title'>" + config.messageTitle + "</h3></div>"
                    + "<div class='box-body box-body-message'>"
                        + "<div class='col-sm-2 rm-padding'><img src='" + imgurl + "' /></div>"
                        + "<div class='col-sm-10 rm-padding'>" + config.message + "</div>"
                    + "</div>"
                    + "<div class='box-footer text-center'>"
                    + "<button type='button' class='btn btn-primary btn-popup button' data-buttonname='OK'>" + config.okButtonTitle + "</button>"
                    + "</div>"
                    + "</div>");


            element.kendoWindow({
                title: false,
                modal: true,
                open: function (e) {
                    var me = this;
                    me.element
                        .find('.button')
                        .click(function (e) {
                            me.clickedButton = $(e.target).data("buttonname");
                            me.close();
                        });
                },
                close: function (e) {
                    if (_.isFunction(config.close)) {
                        config.close({ button: this.clickedButton });
                    }
                },
                deactivate: function () {
                    this.destroy();
                },
                actions: ["Close"],
                width: "450px",
                height: "auto",
            }).getKendoWindow().center().open();
        },

        ShowError: function (error) {
            var message = "";// "<b>Oops - we encountered an error</b> <br/ ><br/ >";

            if (error.responseText !== undefined) {
                var isHtml = /<[a-z][\s\S]*>/i.test(error.responseText) && error.responseText.match("<title>(.*?)</title>") != null;
                if (isHtml) {
                    //alert(error.responseText.match("<title>(.*?)</title>")[1]);
                    message = message + error.responseText.match("<title>(.*?)</title>")[1];
                } else {
                    if (error.responseJSON != undefined) {
                        if (error.responseJSON.ExceptionMessage != undefined) {
                            message = message + error.responseJSON.ExceptionMessage;
                        } else {
                            message = message + error.responseJSON.Message;
                        }
                    }
                    else {
                        message = message + error.responseText;
                    }

                }
            }
            else if (error.statusText != undefined) {
                message = message + error.statusText;
            } else {
                message = message + error;
            }

            vmLayout.AlertDialog({
                message: message,
                messageTitle: "Error",
                messageType: "error",
                okButtonTitle: "OK"
            });
        },

        ShowMessage: function (isvalid, message) {
            vmLayout.AlertDialog({
                message: message,
                messageTitle: "Message",
                messageType: isvalid ? "success" : "error",
                okButtonTitle: "OK"
            });
        },

        InfoMessage: function (message) {
            vmLayout.AlertDialog({
                message: message,
                messageTitle: "Information",
                messageType: "info",
                okButtonTitle: "OK"
            });
        },
    });

    $(function () {

        //var filePath = vmLayout.GetApiUrl("Scripts/ViewModels/Login.js");
        //if ($('head script[src="' + filePath + '"]').length > 0) return;
        //$('head').append("<script src='" + filePath + "'>");

        $(".career-page-link").click(function () {
            var url = $(this).attr("href");
            $(".sidemenu li").removeClass("activetab");
            $(this).parent().addClass("activetab");

            //Emerio.Career.viewModel.GetPageContent(url);
        });


    });

    return { viewModel: vmLayout };
})(jQuery, kendo, Nintex);

var LoginUser = null;



function ShowLoader() {
    $("#Loader").show();
}

function HideLoader() {
    $("#Loader").hide();
}

function GetQueryString(url, param) {
    var url = url.slice(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < url.length; i++) {
        var urlparam = url[i].split('=');
        if (urlparam[0] == param) {
            return urlparam[1];
        }
    }
}

function GetPageContent(url) {
    $.ajax({
        url: url, //'@Url.Action("FunAtWork")',
        cache: false,
        success: function (html) {
            $("#PageContent").html("").append(html);
        },
        error: function (html, status) { alert(status); alert(html.responseText); }
    });
}



// difference in years, months, and days between 2 dates
function DateDifference(dIni, dFin) { //(dIni, dFin)
    var dAux, nAnos, nMeses, nDias, cRetorno
    // final date always greater than the initial
    if (dIni > dFin) {
        dAux = dIni
        dIni = dFin
        dFin = dAux
    }
    // calculate years
    nAnos = dFin.getFullYear() - dIni.getFullYear()
    // translate the initial date to the same year that the final
    dAux = new Date(dIni.getFullYear() + nAnos, dIni.getMonth(), dIni.getDate())
    // Check if we have to take a year off because it is not full
    if (dAux > dFin) {
        --nAnos
    }
    // calculate months
    nMeses = dFin.getMonth() - dIni.getMonth()
    // We add in months the part of the incomplete Year
    if (nMeses < 0) {
        nMeses = nMeses + 12
    }
    // Calculate days
    nDias = dFin.getDate() - dIni.getDate()
    // We add in days the part of the incomplete month
    if (nDias < 0) {
        nDias = nDias + DiasDelMes(dIni)
    }
    // if the day is greater, we quit the month
    if (dFin.getDate() < dIni.getDate()) {
        if (nMeses == 0) {
            nMeses = 11
        }
        else {
            --nMeses
        }
    }
    cRetorno = { "Years": nAnos, "Months": nMeses, "Days": nDias }

    return cRetorno
}

// difference in days between 2 dates
function DateDifferenceInDays(startDate, endDate) {
    var _startDate = new Date(startDate);
    var _endDate = new Date(endDate);
    var timeDiff = Math.abs(_endDate.getTime() - _startDate.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays + 1;
}

function DiasDelMes(date) {
    date = new Date(date);
    return 32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate();
}
function GetDateTimeByTimeZone(instance) {
    var localDate = new Date();
    // convert to msec, add local time zone offset and get UTC time in msec
    var utcTime = localDate.getTime() + (localDate.getTimezoneOffset() * 60000);
    // create new Date object for different city using supplied offset
    switch (instance.toLowerCase()) {
        case "malaysia":
            localDate = new Date(utcTime + (3600000 * 8));
            break;
        case "india":
            localDate = new Date(utcTime + (3600000 * 5.30));
            break;
        case "singapore":
            localDate = new Date(utcTime + (3600000 * 8));
            break;
        case "philippines":
            localDate = new Date(utcTime + (3600000 * 8));
            break;
        case "thailand":
            localDate = new Date(utcTime + (3600000 * 7));
            break;
        case "london":
            localDate = new Date(utcTime + (3600000 * 0));
            break;
        case "newyork":
            localDate = new Date(utcTime + (3600000 * 5));
            break;
        case "hawaii":
            localDate = new Date(utcTime + (3600000 * -10));
            break;
    }
    return localDate;
}

function ConvertToLocalTimeZone(serverdate) {
    var date = new Date(serverdate);
    var toutc = date.toUTCString();
    var locdate = new Date(toutc + " UTC");
    return locdate;
}
