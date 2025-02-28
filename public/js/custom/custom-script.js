/*================================================================================
	Item Name: Materialize - Material Design Admin Template
	Version: 5.0
	Author: PIXINVENT
	Author URL: https://themeforest.net/user/pixinvent/portfolio
================================================================================

NOTE:
------
PLACE HERE YOUR OWN JS CODES AND IF NEEDED.
WE WILL RELEASE FUTURE UPDATES SO IN ORDER TO NOT OVERWRITE YOUR CUSTOM SCRIPT IT'S BETTER LIKE THIS. */

$(document).ready(function () {
    $("#user_profile_modal").modal();
    $("#user_funding_source_modal").modal();
    $("#jpiModel").modal({
        onOpenEnd: function(e,trigger) {
            let loadUrl = $(trigger).data('load-url');
            let title = $(trigger).data('modal-title');
            $(e).find('.modal-title').html(title);
            $(e).find('.modal-body').load(loadUrl);
        }
    });

    $("#userform").click(function () {
        if ($(this).hasClass('show')) {
            $(this).removeClass('show');
            $('.login-form').hide(700);
        } else {
            $(this).addClass('show');
            $('.login-form').show(700);
            $('#userform').hide(400);
        }
    });
    $("#loginbtn").click(function () {
        var email = $.trim($("#email").val());
        $("#email").val(email);
        if (!email) {
            toastr.error("Enter Username.");
            return false;
        }
        var password = $.trim($("#password").val());
        $("#password").val(password);
        if (!password) {
            toastr.error("Enter Password.");
            return false;
        }

    });
    /*
    * Validate Update Profile
    */
    $("#updateprofilebtn").click(function () {
        var firstname = $.trim($("#firstname_profile").val());
        $("#firstname_profile").val(firstname);
        if (!firstname) {
            toastr.error("Enter Firstname.");
            return false;
        }
        var lastname = $.trim($("#lastname_profile").val());
        $("#lastname_profile").val(lastname);
        if (!lastname) {
            toastr.error("Enter Lastname.");
            return false;
        }
        // var address1= $.trim($("#address1_profile").val());
        // $("#address1_profile").val(address1);
        // if(!address1){
        // 	toastr.error("Enter Address 1.");
        // 	return false;
        // }
        // var address2= $.trim($("#address2_profile").val());
        // $("#address2_profile").val(address2);
        // if(!address2){
        // 	toastr.error("Enter Address 2.");
        // 	return false;
        // }
        // var city= $.trim($("#city_profile").val());
        // $("#city_profile").val(city);
        // if(!city){
        // 	toastr.error("Enter City.");
        // 	return false;
        // }
        // var state= $.trim($("#state_profile").val());
        // $("#state_profile").val(state);
        // if(!state){
        // 	toastr.error("Enter State.");
        // 	return false;
        // }
        // var zip= $.trim($("#zip_profile").val());
        // $("#zip_profile").val(zip);
        // if(!zip){
        // 	toastr.error("Enter Zip.");
        // 	return false;
        // }
        var password_confirm = "";
        let password = $.trim($("#password_profile").val());
        if (password) {
            password_length = password.length;

            if (password.length < 8) {
                // $("#character_length").removeClass('ctick').addClass('ccross');
                password_is_valid = false;
            } else {
                // $("#character_length").removeClass('ccross').addClass('ctick');
                password_is_valid = true;
            }
            if (!password.match(/[A-Z]/)) {
                // $("#uppercase_latter").removeClass('ctick').addClass('ccross');
                password_is_valid = false;
            } else {
                // $("#uppercase_latter").removeClass('ccross').addClass('ctick');
                password_is_valid = true;
            }
            if (!password.match(/[a-z]/)) {
                // $("#lowercase_latter").removeClass('ctick').addClass('ccross');
                password_is_valid = false;
            } else {
                // $("#lowercase_latter").removeClass('ccross').addClass('ctick');
                password_is_valid = true;
            }
            if (!password.match(/[0-9]/)) {
                // $("#one_number").removeClass('ctick').addClass('ccross');
                password_is_valid = false;
            } else {
                // $("#one_number").removeClass('ccross').addClass('ctick');
                password_is_valid = true;
            }
            if (!password.match(/[!@#$%^&*]/)) {
                // $("#special_character").removeClass('ctick').addClass('ccross');
                password_is_valid = false;
            } else {
                // $("#special_character").removeClass('ccross').addClass('ctick');
                password_is_valid = true;
            }
            if (!password_is_valid) {
                toastr.error("Password should be as per requirement.");
                return false;
            }

            var password_confirm = $.trim($("#password-confirm_profile").val());
            $("#password-confirm_profile").val(password_confirm);
            if (!password_confirm) {
                toastr.error("Enter Confirm Password.");
                return false;
            }

            if (password_confirm != password) {
                toastr.error("Password not matched.");
                return false;
            }
        }
        var _token = $("input[name='_token']").val();

        var url = $(this).data('url');
        $.ajax({
            type: "PUT",
            dataType: "json",
            url: url,
            data: {
                firstname: firstname,
                lastname: lastname,
                // address1:address1,
                // address2:address2,
                // city:city,
                // state:state,
                // zip:zip,
                password: password,
                password_confirm: password_confirm,
                _token: _token,
                _method: 'PUT',
                from: 'profile_update'
            },
            success: function (response) {
                toastr.success("Updated Successfully.");
                location.reload();
            },
            error: function (response) {
                var errormsg = "";
                if (response.responseJSON.errors.firstname) {
                    errormsg = response.responseJSON.errors.firstname;
                }
                if (response.responseJSON.errors.lastname) {
                    errormsg = response.responseJSON.errors.lastname;
                }
                if (response.responseJSON.errors.address1) {
                    errormsg = response.responseJSON.errors.address1;
                }
                if (response.responseJSON.errors.address1) {
                    errormsg = response.responseJSON.errors.address2;
                }
                if (response.responseJSON.errors.city) {
                    errormsg = response.responseJSON.errors.city;
                }
                if (response.responseJSON.errors.state) {
                    errormsg = response.responseJSON.errors.state;
                }
                if (response.responseJSON.errors.zip) {
                    errormsg = response.responseJSON.errors.zip;
                }
                if (response.responseJSON.errors.password) {
                    errormsg = response.responseJSON.errors.password;
                }
                if (response.responseJSON.errors.password_confirm) {
                    errormsg = response.responseJSON.errors.password_confirm;
                }

                if (errormsg) {
                    toastr.error(errormsg);
                    return false;
                }
            }
        });
    });

    $(document).on('click', "#updateFundingSourceBtn", function () {
        let bank_account = $("input[name='bank_account']").val();
        let bank_nickname = $("input[name='bank_nickname']").val();
        let routing = $("input[name='routing']").val();
        let _token = $("input[name='_token']").val();
        let url = $(this).data('url');
        console.log(url);
        $.ajax({
            type: "PUT",
            dataType: "json",
            url: url,
            data: {
                bank_account: bank_account,
                bank_nickname: bank_nickname,
                routing: routing,
                _token: _token,
                _method: 'PUT',
                from: 'profile_update'
            },
            success: function (response) {
                toastr.success("Updated Successfully.");
                location.reload();
            },
            error: function (response) {
                var errormsg = "";
                if (response.responseJSON.errors.bank_account) {
                    errormsg = response.responseJSON.errors.bank_account;
                }
                if (response.responseJSON.errors.bank_nickname) {
                    errormsg = response.responseJSON.errors.bank_nickname;
                }
                if (response.responseJSON.errors.routing) {
                    errormsg = response.responseJSON.errors.routing;
                }
                if (errormsg) {
                    toastr.error(errormsg);
                    return false;
                }
            }
        });
    });


    $("#jpiModel").on('show.bs.modal', function (e) {

    });
    /*
    * Validate Register Profile
    */
    $("#register_user").click(function () {
        var firstname = $.trim($("#firstname").val());
        $("#firstname").val(firstname);
        if (!firstname) {
            toastr.error("Enter Firstname.");
            return false;
        }
        var lastname = $.trim($("#lastname").val());
        $("#lastname").val(lastname);
        if (!lastname) {
            toastr.error("Enter Lastname.");
            return false;
        }
        // var address1= $.trim($("#address1").val());
        // $("#address1").val(address1);
        // if(!address1){
        // 	toastr.error("Enter Address 1.");
        // 	return false;
        // }
        // var address2= $.trim($("#address2").val());
        // $("#address2").val(address2);
        // if(!address2){
        // 	toastr.error("Enter Address 2.");
        // 	return false;
        // }
        // var city= $.trim($("#city").val());
        // $("#city").val(city);
        // if(!city){
        // 	toastr.error("Enter City.");
        // 	return false;
        // }
        // var state= $.trim($("#state").val());
        // $("#state").val(state);
        // if(!state){
        // 	toastr.error("Enter State.");
        // 	return false;
        // }
        // var zip= $.trim($("#zip").val());
        // $("#zip").val(zip);
        // if(!zip){
        // 	toastr.error("Enter Zip.");
        // 	return false;
        // }

        // var bank_account= $.trim($("#bank_account").val());
        // $("#bank_account").val(bank_account);
        // if(!bank_account){
        // 	toastr.error("Enter Bank Account No.");
        // 	return false;
        // }

        // var bankname= $.trim($("#bankname").val());
        // $("#bankname").val(bankname);
        // if(!bankname){
        // 	toastr.error("Enter Bank Name.");
        // 	return false;
        // }

        var email = $.trim($("#email").val());
        $("#email").val(email);
        if (!email) {
            toastr.error("Enter Email.");
            return false;
        }
        if (email) {
            var check = validEmail(email);
            if (!check) {
                toastr.error("Enter Valid Email.");
                return false;
            }
        }
        let password = $.trim($("#password").val());
        $("#password").val(password);
        if (password == '') {
            toastr.error("Enter Password.");
            return false;
        }

        password_length = password.length;

        if (password.length < 8) {
            // $("#character_length").removeClass('ctick').addClass('ccross');
            password_is_valid = false;
        } else {
            // $("#character_length").removeClass('ccross').addClass('ctick');
            password_is_valid = true;
        }
        if (!password.match(/[A-Z]/)) {
            // $("#uppercase_latter").removeClass('ctick').addClass('ccross');
            password_is_valid = false;
        } else {
            // $("#uppercase_latter").removeClass('ccross').addClass('ctick');
            password_is_valid = true;
        }
        if (!password.match(/[a-z]/)) {
            // $("#lowercase_latter").removeClass('ctick').addClass('ccross');
            password_is_valid = false;
        } else {
            // $("#lowercase_latter").removeClass('ccross').addClass('ctick');
            password_is_valid = true;
        }
        if (!password.match(/[0-9]/)) {
            // $("#one_number").removeClass('ctick').addClass('ccross');
            password_is_valid = false;
        } else {
            // $("#one_number").removeClass('ccross').addClass('ctick');
            password_is_valid = true;
        }
        if (!password.match(/[!@#$%^&*]/)) {
            // $("#special_character").removeClass('ctick').addClass('ccross');
            password_is_valid = false;
        } else {
            // $("#special_character").removeClass('ccross').addClass('ctick');
            password_is_valid = true;
        }
        if (!password_is_valid) {
            toastr.error("Password should be as per requirement.");
            return false;
        }

        var password_confirm = $.trim($("#password-confirm").val());
        $("#password-confirm").val(password_confirm);
        if (!password_confirm) {
            toastr.error("Enter Confirm Password.");
            return false;
        }

        if (password_confirm != password) {
            toastr.error("Password not matched.");
            return false;
        }

        if ($("#term_checkbox").is(":not(:checked)")) {
            toastr.error("Please agree with terms and conditions");
            return false;
        }
    });
    /*
    * Validate Add new User Profile
    */
    $("#addnewuser").click(function () {
        var firstname = $.trim($("#new_firstname").val());
        $("#new_firstname").val(firstname);
        if (!firstname) {
            $("#new_firstname").focus();
            toastr.error("Enter Firstname.");
            return false;
        }
        var lastname = $.trim($("#new_lastname").val());
        $("#new_lastname").val(lastname);
        if (!lastname) {
            $("#new_lastname").focus();
            toastr.error("Enter Lastname.");
            return false;
        }
        var address1 = $.trim($("#new_address1").val());
        $("#new_address1").val(address1);
        if (!address1) {
            $("#new_address1").focus();
            toastr.error("Enter Address 1.");
            return false;
        }
        var address2 = $.trim($("#new_address2").val());
        $("#new_address2").val(address2);
        if (!address2) {
            $("#new_address2").focus();
            toastr.error("Enter Address 2.");
            return false;
        }
        var city = $.trim($("#new_city").val());
        $("#new_city").val(city);
        if (!city) {
            $("#new_city").focus();
            toastr.error("Enter City.");
            return false;
        }
        var state = $.trim($("#new_state").val());
        $("#new_state").val(state);
        if (!state) {
            $("#new_state").focus();
            toastr.error("Enter State.");
            return false;
        }
        var zip = $.trim($("#new_zip").val());
        $("#new_zip").val(zip);
        if (!zip) {
            $("#new_zip").focus();
            toastr.error("Enter Zip.");
            return false;
        }

        var bank_account = $.trim($("#new_bank_account").val());
        $("#new_bank_account").val(bank_account);
        if (!bank_account) {
            $("#new_bank_account").focus();
            toastr.error("Enter Bank Account No.");
            return false;
        }

        var bankname = $.trim($("#new_bankname").val());
        $("#new_bankname").val(bankname);
        if (!bankname) {
            $("#new_bankname").focus();
            toastr.error("Enter Bank Name.");
            return false;
        }

        var email = $.trim($("#new_email").val());
        $("#new_email").val(email);
        if (!email) {
            $("#new_email").focus();
            toastr.error("Enter Email.");
            return false;
        }
        if (email) {
            var check = validEmail(email);
            if (!check) {
                toastr.error("Enter Valid Email.");
                return false;
            }
        }
        let password = $.trim($("#new_password").val());
        $("#new_password").val(password);
        if (password == '') {
            $("#new_password").focus();
            toastr.error("Enter Password.");
            return false;
        }

        password_length = password.length;

        if (password.length < 8) {
            // $("#character_length").removeClass('ctick').addClass('ccross');
            password_is_valid = false;
        } else {
            // $("#character_length").removeClass('ccross').addClass('ctick');
            password_is_valid = true;
        }
        if (!password.match(/[A-Z]/)) {
            // $("#uppercase_latter").removeClass('ctick').addClass('ccross');
            password_is_valid = false;
        } else {
            // $("#uppercase_latter").removeClass('ccross').addClass('ctick');
            password_is_valid = true;
        }
        if (!password.match(/[a-z]/)) {
            // $("#lowercase_latter").removeClass('ctick').addClass('ccross');
            password_is_valid = false;
        } else {
            // $("#lowercase_latter").removeClass('ccross').addClass('ctick');
            password_is_valid = true;
        }
        if (!password.match(/[0-9]/)) {
            // $("#one_number").removeClass('ctick').addClass('ccross');
            password_is_valid = false;
        } else {
            // $("#one_number").removeClass('ccross').addClass('ctick');
            password_is_valid = true;
        }
        if (!password.match(/[!@#$%^&*]/)) {
            // $("#special_character").removeClass('ctick').addClass('ccross');
            password_is_valid = false;
        } else {
            // $("#special_character").removeClass('ccross').addClass('ctick');
            password_is_valid = true;
        }
        if (!password_is_valid) {
            toastr.error("Password should be as per requirement.");
            return false;
        }

        var password_confirm = $.trim($("#new_password-confirm").val());
        $("#new_password-confirm").val(password_confirm);
        if (!password_confirm) {
            $("#new_password-confirm").focus();
            toastr.error("Enter Confirm Password.");
            return false;
        }

        if (password_confirm != password) {
            toastr.error("Password not matched.");
            return false;
        }
    });
});

/*
 *
 * Allow Numbers only
 */
function allowOnlyNumber(e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        return false;
    }
    return true
}

/*
 *
 * Allow Numbers only
 */
function allowOnlyDecimalNumber(e) {
    if (e.which != 8 && e.which != 46 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        return false;
    }
    return true
}

/*
 * Allow Chracter only
 */

function allowOnlyChracter(event) {
    var inputValue = event.which;
    if (!(inputValue == 47) && !(inputValue >= 65 && inputValue <= 120) && event.which != 8 && (inputValue != 32 && inputValue != 0 && inputValue != 121 && inputValue != 122)) {
        event.preventDefault();
        return false;
    }
    if (inputValue == 96) {
        event.preventDefault();
    }
    return true;
}

/*
- Valid Email
*/
function validEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

$(document).ready(function () {
    $('#terms').scroll(function () {
        if ($(this).scrollTop() == $(this)[0].scrollHeight - $(this).height()) {
            $('#register_user').removeAttr('disabled');
            $('#terms_condition').show();
        }
    });
});


$('#img-modal #zip-pop').keyup(function () {
    if (/\D/g.test(this.value)) {
        // Filter non-digits from input value.
        this.value = this.value.replace(/\D/g, '');
    }
});


$(function () {
    $("#register-page input#email").on("click", function (e) {
        $("#register-page .emailaddress-hint").addClass('br-bt');
        e.stopPropagation()
    });
    $(document).on("click", function (e) {
        if ($(e.target).is("#register-page .emailaddress-hint") === false) {
            $("#register-page .emailaddress-hint").removeClass("br-bt");
        }
    });
});
