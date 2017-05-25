

Nintex.Validation = (function ($, kendo, App) {
    var vmValidation = kendo.observable({

        ValidationType: {
            Email: "email",
            Date: "date",
            Number: "number",
            Decimal: "decimal",
            Gender: "gender",
            YN: "yn",
            Characters: "characters",
            Alphanumeric: "alphanumeric",
            SpecialCharacter: "specialcharacter",
            PhoneNumber: "phonenumber"
        },

        ComparedType: {
            EqualTo: "equalto",
            GreaterThan: "greaterthan",
            LessThan: "lessthan",
            LessThanOrEqualTo: "lessthanorequalto",
            Min: "min",
            Fix: "fix",
            Hr0to24: "Hr0to24",
        },

        RegexType: {
            None: 0,
            Email: 1,
            Date: 2,
            Number: 3,
            Gender: 4,
            YN: 5,
            SpecialCharacter: 6,
        },

        RegexEmail: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,

        //RegexDate: /^(?:(0[1-9]|1[012])[\- \/.](0[1-9]|[12][0-9]|3[01])[\- \/.](19|20)[0-9]{2})$/  // for : MM/dd/yyyy, MM-dd-yyyy, MM.dd.yyyy
        RegexDate: /^(\d{1,2})(\/|-)([a-zA-Z]{3})(\/|-)(\d{4})$/,  // for : dd/MMM/yyyy, dd-MMM-yyyy, dd|MM|yyyy
        RegexPhoneNumber: /^[+][0-9]{10,}$/,
        RegexNumber: /^-?[0-9]*$/,
        RegexDecimalNumber: /^-?[0-9]\d*(\.\d+)?$/,  //^\d+(\.\d{1,2})?$/
        RegexGender: /(M|F|m|f)/g,
        RegexYN: /(Y|N|y|n)/g, //"^(?:Y|N)$"
        RegexSpecialCharacter: /^[a-zA-Z0-9 ]*$/,
        RegexCharacters: /^[a-zA-Z ]+$/,


        ValidateForm: function (formId) {
            var isValid = true;
            // Textbox validation
            var $textboxElement = $("#" + formId + " INPUT[type='text']");
            $.each($textboxElement, function (index, $element) {
                var isDisabled = $($element).attr("disabled") == "disabled" ? true : false;
                var isRequired = $($element).data("isrequired");
                var isValidate = $($element).data("isvalidate");
                var RequiredMessage = $($element).data("requiredmessage");
                var ValidateMessage = $($element).data("validatemessage");
                var validationType = $($element).data("validationtype");
                var minLength = $($element).attr("minlength");
                var maxLength = $($element).attr("maxlength");

                var value = $($element).val().trim();
                var dataRole = $($element).data("role");

                if (dataRole == undefined) {
                    if (!isDisabled) {

                        // Required validation
                        if (isRequired && (value == null || value == "")) {
                            $($element).addClass("error-box");
                            var $spanElement = $($element).parent().find("span.error-message");
                            if ($spanElement.length <= 0) {
                                $($element).parent().append("<span class='error-message'>" + RequiredMessage + "</span>");
                            }
                            isValid = false;
                        }
                        else {
                            $($element).removeClass("error-box");
                            $($element).parent().find("span.error-message").remove();
                        }
                        // Valid validation
                        if (isValidate && value != "") {
                            var flag = false;
                            switch (validationType) {
                                case vmValidation.ValidationType.Email: if (!vmValidation.IsValidEmail(value)) flag = true; break;
                                case vmValidation.ValidationType.Date: if (!vmValidation.IsValidDate(value)) flag = true; break;
                                case vmValidation.ValidationType.Number: if (!vmValidation.IsValidNumber(value)) flag = true; break;
                                case vmValidation.ValidationType.Decimal: if (!vmValidation.IsValidDecimalNumber(value)) flag = true; break;
                                case vmValidation.ValidationType.Gender: break;
                                case vmValidation.ValidationType.YN: break;
                                case vmValidation.ValidationType.Characters: if (!vmValidation.IsCharacters(value)) flag = true; break;
                                case vmValidation.ValidationType.Alphanumeric: if (!vmValidation.IsValidAlphanumeric(value)) flag = true; break;
                                case vmValidation.ValidationType.SpecialCharacter: if (!vmValidation.IsValidSpecialCharacter(value)) flag = true; break;
                                case vmValidation.ValidationType.PhoneNumber: if (!vmValidation.IsValidPhoneNumber(value)) flag = true; break;
                                
                            }

                            if (!flag)
                            {
                                if ((minLength != undefined || minLength != null))
                                {
                                    if (value.length < minLength) flag = true;
                                }
                            }

                            if (flag) {
                                $($element).addClass("error-box");
                                var $spanElement = $($element).parent().find("span.error-message");
                                if ($spanElement.length <= 0) {
                                    $($element).parent().append("<span class='error-message'>" + ValidateMessage + "</span>");
                                }
                                else
                                    $spanElement.html(ValidateMessage);
                                isValid = false;
                            }
                            else {
                                $($element).removeClass("error-box");
                                $($element).parent().find("span.error-message").remove();
                            }
                        }
                    }
                }
            });

            // Auto Complete validation
            var $dropdownElement = $("#" + formId + " INPUT[data-role='autocomplete']");
            $.each($dropdownElement, function (index, $element) {
                var value = $($element).val();
                var isDisabled = $($element).attr("disabled") == "disabled" ? true : false;
                var isRequired = $($element).data("isrequired");

                var controlId = $($element).data("controlid");
                var RequiredMessage = $($element).data("requiredmessage");
                var $elementWraper = $($element.parentElement);

                if (!isDisabled) {
                    if (isRequired && (value == null || value == "")) {
                        $($element.parentElement).addClass("error-box");
                        var $spanElement = $($element.parentElement).parent().find("span.error-message");
                        if ($spanElement.length <= 0) {
                            $($element.parentElement).parent().append("<span class='error-message'>" + RequiredMessage + "</span>");
                        }
                        isValid = false;
                    }
                    else {
                        $($element.parentElement).removeClass("error-box");
                        $($element.parentElement).parent().find("span.error-message").remove();
                    }
                }
            });

            // Drop down list validation
            var $dropdownElement = $("#" + formId + " .k-dropdown .k-input");
            $.each($dropdownElement, function (index, $element) {
                var objId = $($element.parentElement.parentElement.childNodes[1]).attr("id");
                if (objId != undefined) {
                    var $ddlElement = $("#" + formId + " #" + objId);
                    var dropdownlist = $($ddlElement).data("kendoDropDownList");
                    var value = dropdownlist.value(); //dropdownlist.text(); // $element.innerText;
                    var isDisabled = $ddlElement.attr("disabled") == "disabled" ? true : false;
                    var isRequired = $ddlElement.data("isrequired");
                    var RequiredMessage = $ddlElement.data("requiredmessage");
                    if (!isDisabled) {
                        if (isRequired && (value == null || value == "" || value == "-1")) {
                            $($element.parentElement.parentElement).addClass("error-box");
                            var $spanElement = $($element.parentElement.parentElement).parent().find("span.error-message");
                            if ($spanElement.length <= 0) {
                                $($element.parentElement.parentElement).parent().append("<span class='error-message'>" + RequiredMessage + "</span>");
                            }
                            isValid = false;
                        }
                        else {
                            $($element.parentElement.parentElement).removeClass("error-box");
                            $($element.parentElement.parentElement).parent().find("span.error-message").remove();
                        }
                    }
                }
            });

            // Multi Select List validate
            var $multiSelectElement = $("#" + formId + " .k-multiselect .k-input");
            $.each($multiSelectElement, function (index, $element) {
                var objId = $($element.parentElement.parentElement.childNodes[1]).attr("id");
                var $ddlElement = $("#" + formId + " #" + objId);
                var value = $($ddlElement).data("kendoMultiSelect").value().toString();
                var isDisabled = $ddlElement.attr("disabled") == "disabled" ? true : false;
                var isRequired = $ddlElement.data("isrequired");
                var RequiredMessage = $ddlElement.data("requiredmessage");
                if (!isDisabled) {
                    if (isRequired && (value == null || value == "")) {
                        $($element.parentElement.parentElement).addClass("error-box");
                        var $spanElement = $($element.parentElement.parentElement).parent().find("span.error-message");
                        if ($spanElement.length <= 0) {
                            $($element.parentElement.parentElement).parent().append("<span class='error-message'>" + RequiredMessage + "</span>");
                        }
                        isValid = false;
                    }
                    else {
                        $($element.parentElement.parentElement).removeClass("error-box");
                        $($element.parentElement.parentElement).parent().find("span.error-message").remove();
                    }
                }
            });

            //Radio button validation
            var $radioElement = $("#" + formId + " DIV[data-type='radio']");
            $.each($radioElement, function (index, $element) {
                var name = $($element).data("name");
                var value = $("input[name='" + name + "']:checked").val();
                var isDisabled = $($element).attr("disabled") == "disabled" ? true : false;
                var isRequired = $($element).data("isrequired");
                var RequiredMessage = $($element).data("requiredmessage");

                if (!isDisabled) {
                    if (isRequired && (value == undefined || value == "")) {
                        //$($element.parentElement.parentElement).addClass("error-box");
                        var $spanElement = $($element).parent().find("span.error-message");
                        if ($spanElement.length <= 0) {
                            $($element).parent().append("<span class='error-message'>" + RequiredMessage + "</span>");
                        }
                        isValid = false;
                    }
                    else {
                        //$($element.parentElement.parentElement).removeClass("error-box");
                        $($element).parent().find("span.error-message").remove();
                    }
                }
            });

            //Checkbox validation
            var $checkboxElement = $("#" + formId + " INPUT[type='checkbox']");
            $.each($checkboxElement, function (index, $element) {
                var value = $($element).is(":checked");
                var value2 = $($element).prop("checked");
                var isDisabled = $($element).attr("disabled") == "disabled" ? true : false;
                var isRequired = $($element).data("isrequired");
                var RequiredMessage = $($element).data("requiredmessage");


                if (!isDisabled) {
                    if (isRequired && !value) {
                        //$($element.parentElement.parentElement).addClass("error-box");
                        var $spanElement = $($element).parent().find("span.error-message");
                        if ($spanElement.length <= 0) {
                            $($element).parent().append("<span class='error-message'>" + RequiredMessage + "</span>");
                        }
                        isValid = false;
                    }
                    else {
                        //$($element.parentElement.parentElement).removeClass("error-box");
                        $($element).parent().find("span.error-message").remove();
                    }
                }
            });

            //Date validation
            var $dateElement = $("#" + formId + " INPUT[data-role='datepicker']");
            $.each($dateElement, function (index, $element) {
                var value = $($element).val();
                var id = $($element).attr("id");
                var isDisabled = $($element).attr("disabled") == "disabled" ? true : false;
                var isRequired = $($element).data("isrequired");
                var isCompared = $($element).data("iscompared");
                var isCompared2 = $($element).data("iscompared2");
                var isValidate = $($element).data("isvalidate");

                var controlId = $($element).data("controlid");
                var controlId2 = $($element).data("controlid2");
                var RequiredMessage = $($element).data("requiredmessage");
                var ValidateMessage = $($element).data("validatemessage");
                var ComparedMessage = $($element).data("comparedmessage");
                var ComparedMessage2 = $($element).data("comparedmessage2");
                var comparedType = $($element).data("comparedtype");
                var comparedType2 = $($element).data("comparedtype2");
                var compareYear = $($element).data("compareyear");

                var $elementWraper = $($element.parentElement.parentElement);

                if (!isDisabled) {
                    // Required validation
                    if (isRequired && (value == null || value == "")) {
                        $($elementWraper).addClass("error-box");
                        var $spanElement = $($elementWraper).parent().find("span.error-message");
                        if ($spanElement.length <= 0) {
                            $($elementWraper).parent().append("<span class='error-message'>" + RequiredMessage + "</span>");
                        }
                        isValid = false;
                    }
                    else {
                        $($elementWraper).removeClass("error-box");
                        $($elementWraper).parent().find("span.error-message").remove();
                    }

                    // Valid validation
                    if (isValidate && value != "") {
                        if (!vmValidation.IsValidDate(value)) {
                            $($elementWraper).addClass("error-box");
                            var $spanElement = $($elementWraper).parent().find("span.error-message");
                            if ($spanElement.length <= 0) {
                                $($elementWraper).parent().append("<span class='error-message'>" + ValidateMessage + "</span>");
                            }
                            else
                                $spanElement.html(ValidateMessage);
                            isValid = false;
                        }
                        else {
                            $($elementWraper).removeClass("error-box");
                            $($elementWraper).parent().find("span.error-message").remove();
                        }
                    }

                    // Compared validation
                    if ((isCompared || isCompared2) && value != "") {
                        var valueControl1 = $("#" + controlId).val() == "" ? $("#" + controlId).text() : $("#" + controlId).val();
                        var valueControl2 = $("#" + controlId2).val();
                        var flagControl1 = false, falgControl2 = false;
                        var date1Control1 = kendo.parseDate(valueControl1, "dd-MMM-yyyy");
                        var date2Control1 = kendo.parseDate(value, "dd-MMM-yyyy");

                        var date1Control2 = kendo.parseDate(valueControl2, "dd-MMM-yyyy");
                        var date2Control2 = kendo.parseDate(value, "dd-MMM-yyyy");
                        if (isCompared) {
                            switch (comparedType) {
                                case vmValidation.ComparedType.EqualTo: if (kendo.toString(date1Control1, "dd/MM/yyyy") != kendo.toString(date2Control1, "dd/MM/yyyy")) flagControl1 = true; break; //date2 != date1
                                case vmValidation.ComparedType.GreaterThan: if (date2Control1 > date1Control1) flagControl1 = true; break;
                                case vmValidation.ComparedType.LessThan: if (date2Control1 < date1Control1) flagControl1 = true; break;
                                case vmValidation.ComparedType.LessThanOrEqualTo: if (date2Control1 <= date1Control1) flagControl1 = true; break;
                                case vmValidation.ComparedType.Min: if (DateDifference(date2Control1, new Date()).Years < compareYear) flagControl1 = true; break;
                                case vmValidation.ComparedType.Fix: if (date2Control1 < date1Control1) flagControl1 = true; break;
                            }
                        }

                        if (isCompared2) {
                            switch (comparedType2) {
                                case vmValidation.ComparedType.EqualTo: if (kendo.toString(date1Control2, "dd/MM/yyyy") != kendo.toString(date2Control2, "dd/MM/yyyy")) falgControl2 = true; break; //date2 != date1
                                case vmValidation.ComparedType.GreaterThan: if (date2Control2 > date1Control2) falgControl2 = true; break;
                                case vmValidation.ComparedType.LessThan: if (date2Control2 < date1Control2) falgControl2 = true; break;
                                case vmValidation.ComparedType.LessThanOrEqualTo: if (date2Control2 <= date1Control2) falgControl2 = true; break;
                                case vmValidation.ComparedType.Min: if (DateDifference(date2Control2, new Date()).Years < compareYear) falgControl2 = true; break;
                                case vmValidation.ComparedType.Fix: if (date2Control2 < date1Control2) falgControl2 = true; break;
                            }
                        }

                        if (flagControl1 || falgControl2) {
                            $($elementWraper).addClass("error-box");
                            var $spanElement = $($elementWraper).parent().find("span.error-message");
                            if ($spanElement.length <= 0) {
                                var message = "";
                                if (flagControl1) message = ComparedMessage;
                                if (falgControl2) message = ComparedMessage2;
                                $($elementWraper).parent().append("<span class='error-message'>" + message + ".</span>");
                            }
                            isValid = false;
                        }
                        else {
                            $($elementWraper).removeClass("error-box");
                            $($elementWraper).parent().find("span.error-message").remove();
                        }
                    }
                }
            });

            //Date Time validation
            var $datetimeElement = $("#" + formId + " INPUT[data-role='datetimepicker']");
            $.each($datetimeElement, function (index, $element) {
                var value = $($element).val();
                var id = $($element).attr("id");
                var isDisabled = $($element).attr("disabled") == "disabled" ? true : false;
                var isRequired = $($element).data("isrequired");
                var isCompared = $($element).data("iscompared");
                //var isValidate = $($element).data("isvalidate");

                var controlId = $($element).data("controlid");
                var RequiredMessage = $($element).data("requiredmessage");
                //var ValidateMessage = $($element).data("validatemessage");
                var ComparedMessage = $($element).data("comparedmessage");
                var comparedType = $($element).data("comparedtype");
                //var compareYear = $($element).data("compareyear");
                var $elementWraper = $($element.parentElement.parentElement);
                if (!isDisabled) {
                    // Required validation
                    if (isRequired && (value == null || value == "")) {
                        $($elementWraper).addClass("error-box");
                        var $spanElement = $($elementWraper).parent().find("span.error-message");
                        if ($spanElement.length <= 0) {
                            $($elementWraper).parent().append("<span class='error-message'>" + RequiredMessage + "</span>");
                        }
                        isValid = false;
                    }
                    else {
                        $($elementWraper).removeClass("error-box");
                        $($elementWraper).parent().find("span.error-message").remove();
                    }

                    // Valid validation
                    //if (isValidate && value != "") {
                    //    if (!vmValidation.IsValidDate(value)) {
                    //        $($elementWraper).addClass("error-box");
                    //        var $spanElement = $($elementWraper).parent().find("span.error-message");
                    //        if ($spanElement.length <= 0) {
                    //            $($elementWraper).parent().append("<span class='error-message'>" + ValidateMessage + "</span>");
                    //        }
                    //        else
                    //            $spanElement.html(ValidateMessage);
                    //        isValid = false;
                    //    }
                    //    else {
                    //        $($elementWraper).removeClass("error-box");
                    //        $($elementWraper).parent().find("span.error-message").remove();
                    //    }
                    //}

                    // Compared validation
                    if (isCompared && value != "") {
                        var value2 = $("#" + controlId).val();
                        var flag = false;
                        var date1 = kendo.parseDate(value2, "dd-MMM-yyyy HH:mm:ss");
                        var date2 = kendo.parseDate(value, "dd-MMM-yyyy HH:mm:ss");
                        switch (comparedType) {
                            //case vmValidation.ComparedType.EqualTo: break;
                            //case vmValidation.ComparedType.GreaterThan: if (date2 > date1) flag = true; break;
                            //case vmValidation.ComparedType.LessThan: if (date2 < date1) flag = true; break;
                            //case vmValidation.ComparedType.Min: if (DateDifference(date2, new Date()).Years < compareYear) flag = true; break;
                            case vmValidation.ComparedType.Hr0to24:
                                var hrsDiff = (date2 - date1) / 36e5;
                                if (hrsDiff <= 0 || hrsDiff > 24)
                                    flag = true;
                                break;
                        }
                        if (flag) {
                            $($elementWraper).addClass("error-box");
                            var $spanElement = $($elementWraper).parent().find("span.error-message");
                            if ($spanElement.length <= 0) {
                                $($elementWraper).parent().append("<span class='error-message'>" + ComparedMessage + ".</span>");
                            }
                            isValid = false;
                        }
                        else {
                            $($elementWraper).removeClass("error-box");
                            $($elementWraper).parent().find("span.error-message").remove();
                        }
                    }

                }
            });

            //Email validation
            var $emailElement = $("#" + formId + " INPUT[type='email']");
            $.each($emailElement, function (index, $element) {
                var value = $($element).val();
                var isDisabled = $($element).attr("disabled") == "disabled" ? true : false;
                var isRequired = $($element).data("isrequired");
                var isValidate = $($element).data("isvalidate");
                var RequiredMessage = $($element).data("requiredmessage");
                var ValidateMessage = $($element).data("validatemessage");

                if (!isDisabled) {
                    if (isRequired && (value == null || value == "")) {
                        $($element).addClass("error-box");
                        var $spanElement = $($element).parent().find("span.error-message");
                        if ($spanElement.length <= 0) {
                            $($element).parent().append("<span class='error-message'>" + RequiredMessage + "</span>");
                        }
                        isValid = false;
                    }
                    else {
                        $($element).removeClass("error-box");
                        $($element).parent().find("span.error-message").remove();
                    }

                    if (isValidate && value != "") {
                        if (!vmValidation.IsValidEmail(value)) {
                            $($element).addClass("error-box");
                            var $spanElement = $($element).parent().find("span.error-message");
                            if ($spanElement.length <= 0) {
                                $($element).parent().append("<span class='error-message'>" + ValidateMessage + "</span>");
                            }
                            else
                                $spanElement.html(ValidateMessage);
                            isValid = false;
                        }
                        else {
                            $($element).removeClass("error-box");
                            $($element).parent().find("span.error-message").remove();
                        }
                    }
                }
            });

            // Password validation
            var $textboxElement = $("#" + formId + " INPUT[type='password']");
            $.each($textboxElement, function (index, $element) {
                var isDisabled = $($element).attr("disabled") == "disabled" ? true : false;
                var isRequired = $($element).data("isrequired");
                var isCompared = $($element).data("iscompared");
                var isValidate = $($element).data("isvalidate");
                var ValidateMessage = $($element).data("validatemessage");
                var controlId = $($element).data("controlid");
                var RequiredMessage = $($element).data("requiredmessage");
                var ComparedMessage = $($element).data("comparedmessage");
                var value = $($element).val();
                var dataRole = $($element).data("role");

                if (dataRole == undefined) {
                    if (!isDisabled) {
                        // Required validation
                        if (isRequired && (value == null || value == "")) {
                            $($element).addClass("error-box");
                            var $spanElement = $($element).parent().find("span.error-message");
                            if ($spanElement.length <= 0) {
                                $($element).parent().append("<span class='error-message'>" + RequiredMessage + "</span>");
                            }
                            isValid = false;
                        }
                        else {
                            $($element).removeClass("error-box");
                            $($element).parent().find("span.error-message").remove();
                        }

                        // Valid validation
                        if (isValidate && value != "") {
                            //isValid = vmValidation.IsValideEmail(value);
                            if (!vmValidation.IsValidPassword(value)) {
                                $($element).addClass("error-box");
                                var $spanElement = $($element).parent().find("span.error-message");
                                if ($spanElement.length <= 0) {
                                    $($element).parent().append("<span class='error-message'>" + ValidateMessage + "</span>");
                                }
                                else
                                    $spanElement.html(ValidateMessage);
                                isValid = false;
                            }
                            else {
                                $($element).removeClass("error-box");
                                $($element).parent().find("span.error-message").remove();
                            }
                        }

                        // Compare validation
                        if (isCompared) {
                            var value2 = $("#" + controlId).val();
                            if (value != value2) {
                                $($element).addClass("error-box");
                                var $spanElement = $($element).parent().find("span.error-message");
                                if ($spanElement.length <= 0) {
                                    $($element).parent().append("<span class='error-message'>" + ComparedMessage + ".</span>");
                                }
                                isValid = false;
                            }
                            else {
                                $($element).removeClass("error-box");
                                $($element).parent().find("span.error-message").remove();
                            }
                        }
                    }
                }
            });

            // Number validation
            var $textboxElement = $("#" + formId + " INPUT[type='number']");
            $.each($textboxElement, function (index, $element) {
                var isDisabled = $($element).attr("disabled") == "disabled" ? true : false;
                var isRequired = $($element).data("isrequired");
                var RequiredMessage = $($element).data("requiredmessage");
                var value = $($element).val();
                var dataRole = $($element).data("role");

                if (dataRole == undefined) {
                    if (!isDisabled) {
                        if (isRequired && (value == null || value == "")) {
                            $($element).addClass("error-box");
                            var $spanElement = $($element).parent().find("span.error-message");
                            if ($spanElement.length <= 0) {
                                $($element).parent().append("<span class='error-message'>" + RequiredMessage + "</span>");
                            }
                            isValid = false;
                        }
                        else {
                            $($element).removeClass("error-box");
                            $($element).parent().find("span.error-message").remove();
                        }
                    }
                }
            });

            // File validation
            var $textboxElement = $("#" + formId + " INPUT[type='file']");
            $.each($textboxElement, function (index, $element) {
                var isDisabled = $($element).attr("disabled") == "disabled" ? true : false;
                var isRequired = $($element).data("isrequired");
                var isValidate = $($element).data("isvalidate");
                var RequiredMessage = $($element).data("requiredmessage");
                var ValidateMessage = $($element).data("validatemessage");
                var fileType = $($element).data("filetype");
                var fileName = $($element).data("filename");
                var isFileExist = $($element).data("isfileexist");

                var value = $($element).val();
                var dataRole = $($element).data("role");

                if (dataRole == undefined) {
                    if (!isDisabled) { // && !isFileExist
                        if (isRequired && !isFileExist && (fileName == null || fileName == "null" || fileName == "")) { //(value == null || value == "")
                            $($element).parent().find(".btn").addClass("error-box");
                            var $spanElement = $($element).parent().parent().find("span.error-message");
                            if ($spanElement.length <= 0) {
                                $($element).parent().parent().append("<span class='error-message'>" + RequiredMessage + "</span>");
                            }
                            isValid = false;
                        }
                        else {
                            $($element).parent().find(".btn").removeClass("error-box");
                            $($element).parent().parent().find("span.error-message").remove();
                        }

                        if (isValidate && isFileExist && fileName != "") { //value != ""
                            if ($.inArray(fileName.split('.').pop().toLowerCase(), fileType.split(',')) == -1) {

                                //Nintex.Layout.viewModel.ShowMessage("Only '.jpeg','.jpg', '.png', '.bmp' file formats are allowed.");
                                ////alert("Only '.jpeg','.jpg', '.png', '.gif', '.bmp' formats are allowed.");
                                //$('#ProfileImage').attr('src', '');
                                //return false;

                                $($element).parent().find(".btn").addClass("error-box");
                                var $spanElement = $($element).parent().parent().find("span.error-message");
                                if ($spanElement.length <= 0) {
                                    $($element).parent().parent().append("<span class='error-message'>" + ValidateMessage + "</span>");
                                }
                                else
                                    $spanElement.html(ValidateMessage);
                                isValid = false;
                            }
                            else {
                                $($element).parent().find(".btn").removeClass("error-box");
                                $($element).parent().parent().find("span.error-message").remove();
                            }
                        }
                    }
                }
            });


            // TEXTAREA validation
            var $textboxElement = $("#" + formId + " TEXTAREA");
            $.each($textboxElement, function (index, $element) {
                var isDisabled = $($element).attr("disabled") == "disabled" ? true : false;
                var isRequired = $($element).data("isrequired");
                var RequiredMessage = $($element).data("requiredmessage");
                var value = $($element).val();
                var dataRole = $($element).data("role");

                if (dataRole == undefined) {
                    if (!isDisabled) {
                        if (isRequired && (value == null || value == "")) {
                            $($element).addClass("error-box");
                            var $spanElement = $($element).parent().find("span.error-message");
                            if ($spanElement.length <= 0) {
                                $($element).parent().append("<span class='error-message'>" + RequiredMessage + "</span>");
                            }
                            isValid = false;
                        }
                        else {
                            $($element).removeClass("error-box");
                            $($element).parent().find("span.error-message").remove();
                        }
                    }
                }
            });

            // Editor Max Lenght validation
            var $editorElement = $("#" + formId + " .k-editor");
            $.each($editorElement, function (index, $element) {
                var editorObj = $($element).find("TEXTAREA")
                var isDisabled = editorObj.attr("disabled") == "disabled" ? true : false;
                var isRequired = editorObj.data("isrequired");
                var RequiredMessage = editorObj.data("requiredmessage");
                var maxLength = editorObj.data("maxlength");
                var maxLengthMessage = editorObj.data("maxlengthmessage");
                var value = editorObj.val().trim();
                var dataRole = editorObj.data("role");


                //value = value.replace(/[\r\n\v\f\t ]+/ig, "");
                //value = value.replace(/&amp;nbsp;/g, "").trim();
                //value = value.replace(/\&lt;/gi, "<");
                //value = value.replace(/\&gt;/gi, ">");

                //if (value.indexOf('>') > 0 || value.indexOf('<') > 0) {
                //    value = $(value).text();
                //}

                if (!isDisabled) {
                    // Required validation
                    if (isRequired && (value == null || value == "")) {
                        $($element).addClass("error-box");
                        var $spanElement = $($element).parent().find("span.error-message");
                        if ($spanElement.length <= 0) {
                            $($element).parent().append("<span class='error-message'>" + RequiredMessage + "</span>");
                        }
                        //else {
                        //    $spanElement.html(RequiredMessage);
                        //}
                        isValid = false;
                    }
                    else {
                        $($element).removeClass("error-box");
                        $($element).parent().find("span.error-message").remove();
                    }
                    // Max Length validation
                    if ((maxLength != undefined || maxLength > 0) && (value != null || value != "")) {
                        if (value.length > maxLength) {
                            $($element).addClass("error-box");
                            var $spanElement = $($element).parent().find("span.error-message");
                            if ($spanElement.length <= 0) {
                                $($element).parent().append("<span class='error-message'>" + maxLengthMessage + ".</span>");
                            }
                            else {
                                $spanElement.html(maxLengthMessage);
                            }
                            isValid = false;
                        }
                        else {
                            $($element).removeClass("error-box");
                            $($element).parent().find("span.error-message").remove();
                        }
                    }
                }
            });

            return isValid;
        },

        CleanValidationErrorForm: function (formId) {
            var $textboxElement = $("#" + formId + " .error-box");
            $.each($textboxElement, function (index, $element) {
                $($element).removeClass("error-box");
                $($element).parent().find("span.error-message").remove();
            });
        },

        IsValidDate: function (date) {
            if (date.match(vmValidation.RegexDate)) {
                return true;
            } else {
                return false;
            }
        },

        IsCharacters: function (value) {
            if (vmValidation.RegexCharacters.test(value)) {
                return true;
            } else {
                return false;
            }
        },

        IsValidEmail: function (value) {
            var isValid = value.match(vmValidation.RegexEmail);
            if (vmValidation.RegexEmail.test(value)) {
                return true;
            } else {
                return false;
            }
        },

        IsValidNumber: function (value) {
            var isValid = value.match(vmValidation.RegexNumber);
            if (vmValidation.RegexNumber.test(value)) {
                return true;
            } else {
                return false;
            }
        },

        IsValidDecimalNumber: function (value) {
            var isValid = value.match(vmValidation.RegexDecimalNumber);
            if (vmValidation.RegexDecimalNumber.test(value)) {
                return true;
            } else {
                return false;
            }
        },

        IsValidAlphanumeric: function (value) {
            var isValid = value.match(vmValidation.RegexSpecialCharacter);
            if (vmValidation.RegexSpecialCharacter.test(value)) {
                return true;
            } else {
                return false;
            }
        },

        IsValidSpecialCharacter: function (value) {
            var isValid = value.match(vmValidation.RegexSpecialCharacter);
            if (vmValidation.RegexSpecialCharacter.test(value)) {
                return true;
            } else {
                return false;
            }
        },

        IsValidPhoneNumber: function (value) {
            var isValid = value.match(vmValidation.RegexPhoneNumber);
            if (vmValidation.RegexPhoneNumber.test(value)) {
                return true;
            } else {
                return false;
            }
        },

        IsValidPassword: function (Password) {

            var chars = Password.split('');
            if (Password.length < 6)
                return false;

            var Caps = 0;
            var SpChar = 0;
            var number = 0;
            var Small = 0;

            for (var i = 0; i <= Password.length - 1; i++) {
                if ((chars[i]).charCodeAt() >= 65 && chars[i].charCodeAt() <= 90) {
                    Caps += 1;
                }
                if ((chars[i]).charCodeAt() >= 97 && chars[i].charCodeAt() <= 122) {
                    Small += 1;
                }
                if ((chars[i]).charCodeAt() >= 32 && chars[i].charCodeAt() <= 64) {
                    SpChar += 1;
                }
                if ((chars[i]).charCodeAt() >= 47 && chars[i].charCodeAt() <= 57) {
                    number += 1;
                }

            }

            if (Caps >= 3 && Small >= 1 && SpChar >= 1 && number >= 1)
                return true;
        },

        IsValidFile: function ($element) {
            var isDisabled = $element.attr("disabled") == "disabled" ? true : false;
            var isRequired = $element.data("isrequired");
            var isValidate = $element.data("isvalidate");
            var requiredMessage = $element.data("requiredmessage");
            var validateMessage = $element.data("validatemessage");
            var fileType = $element.data("filetype");
            var isFileExist = $element.data("isfileexist");
            //var value = $element.val();

            var files = $element.get(0).files;  //$element.context.files;
            var dataRole = $element.data("role");

            var isValid = true;
            if (dataRole == undefined) {
                if (!isDisabled) {  // && !isFileExist

                    // Required validation
                    if (isRequired && files.length < 0) { //(value == null || value == "")
                        $element.parent().find(".btn").addClass("error-box"); //.css("border-width", "1px").css("border-style", "solid");;
                        var $spanElement = $element.parent().parent().find("span.error-message");
                        if ($spanElement.length <= 0) {
                            $element.parent().parent().append("<span class='error-message'>" + requiredMessage + "</span>");
                        }
                        isValid = false;
                    }
                    else {
                        $element.parent().find(".btn").removeClass("error-box"); //.css("border-width", "0px").css("border-style", "solid");;
                        $element.parent().parent().find("span.error-message").remove();
                    }

                    // Valid validation
                    if (isValidate && files.length > 0) {
                        for (var i = 0; i < files.length; i++) {
                            var file = files[i];
                            if ($.inArray(files[i].name.split('.').pop().toLowerCase(), fileType.split(',')) == -1) {
                                isValid = false;
                                break;
                            }
                        }

                        if (!isValid) {
                            $element.parent().find(".btn").addClass("error-box"); //.css("border-width", "1px").css("border-style", "solid");
                            var $spanElement = $element.parent().parent().find("span.error-message");
                            if ($spanElement.length <= 0) {
                                $element.parent().parent().append("<span class='error-message'>" + validateMessage + "</span>");
                            }
                            else
                                $spanElement.html(validateMessage);
                        }
                        else {
                            $element.parent().find(".btn").removeClass("error-box"); //.css("border-width", "0px").css("border-style", "solid");
                            $element.parent().parent().find("span.error-message").remove();
                        }
                    }
                }
            }
            return isValid;
        },

        ValidateData: function (dataSource, type) {
            var validationModel;
            var allValid = true;
            var errorCounter = 0;

            switch (type) {
                case vmValidation.ValidationType.School:
                    validationModel = vmValidation.School;
                    break;
                case vmValidation.ValidationType.Class:
                    validationModel = vmValidation.Class;
                    break;
                case vmValidation.ValidationType.Teacher:
                    validationModel = vmValidation.Teacher;
                    break;
                case vmValidation.ValidationType.Student:
                    validationModel = vmValidation.Student;
                    break;
                default:
            }

            _.any(dataSource, function (item) {
                _.any(validationModel, function (validationItem) {
                    // Checks whether the field is Mandatory AND fieldIsEmpty is set to true
                    if (validationItem.Mandatory && item[validationItem.EmptyIndicator] == true) {
                        allValid = false;
                        errorCounter++;
                    }

                    // Checks whether the field should be valid, AND fieldIsValid is set to false
                    if (validationItem.ShouldBeValid && validationItem.ColumnName != "FirstName" && validationItem.ColumnName != "LastName" && item[validationItem.ValidIndicator] == false) {
                        allValid = false;
                        errorCounter++;
                    }
                });
            });

            return {
                AllValid: allValid,
                ErrorCounter: errorCounter
            };
        }

    });
    return { Validate: vmValidation };
})(jQuery, kendo, Nintex);
