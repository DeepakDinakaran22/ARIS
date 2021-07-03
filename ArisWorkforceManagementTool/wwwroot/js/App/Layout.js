var isNewAndOldPasswordMatch = false;
var isConfirmPasswordMatch = false;
var isCurrentPasswordCorrect = false;
$(document).ready(function () {
    $('body').addClass('text-sm');
    ResetPwd();
    $("#btnSavePassword").hide();
    $(".elevation-2").css('height', '33.59px', 'width', '33.59px'); // this is for the logged in user image size
});
$("#btnChangePassword").click(function () {

});
$("#Oldpassword-input").focusout(function () {
    CheckOldPassword();
});
$("#password-input").focusout(function () {
    CheckPreviousPassword();
    if ($("#Confirmpassword-input").val().trim() != '') {
        CheckConfirmPassword();
    }
});
$("#Confirmpassword-input").focusout(function () {
    CheckConfirmPassword();
});

$("#Confirmpassword-input").keyup(function () {
    var newPassword = $("#password-input").val().trim();
    var ConfirmPassword = $("#Confirmpassword-input").val().trim();
    if (newPassword == ConfirmPassword) {
        $("#btnSavePassword").show();
        $("#incorrectConfirmPwd").hide();

    }
    else {
        $("#btnSavePassword").hide();
        $("#incorrectConfirmPwd").show().val('Password Mismatch').css('color', 'red');

    }
});


function CheckConfirmPassword() {
    try {
        var newPassword = $("#password-input").val().trim();
        var ConfirmPassword = $("#Confirmpassword-input").val().trim();
        if (newPassword != ConfirmPassword) {
            isConfirmPasswordMatch = false;
            $("#incorrectConfirmPwd").show().val('Password Mismatch').css('color','red');
            $("#incorrectConfirmPwd").focus();
            $("#btnSavePassword").hide();
        }
        else {
            $("#incorrectConfirmPwd").css('color', '');
            $("#incorrectConfirmPwd").hide();
            isConfirmPasswordMatch = true;
            $("#btnSavePassword").show();
        }
    }
    catch (err) {
        console.log(err);
    }
}

function CheckPreviousPassword() {
    try {
        var newPassword = $("#password-input").val().trim();
        var oldPassword = $("#Oldpassword-input").val().trim();
        if (newPassword == oldPassword) {
            isNewAndOldPasswordMatch = true;
            $("#incorrectNewPwd").show().val('Old and new password shole not be same');
            $("#incorrectNewPwd").focus();        }
        else {
            $("#incorrectNewPwd").hide();
            isNewAndOldPasswordMatch = false;
        }
    }
    catch (err) {
        console.log(err);
    }
}

function CheckOldPassword() {
    try {
        showLoader(true);
        var userId = $("#hdnUserId").val();
        var pwd = $("#Oldpassword-input").val().trim();
        $.ajax({
            type: "GET",
            url: "/Home/CheckCurrentPassword",
            data: { userId: parseInt(userId), pwd: pwd  },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null) {
                    if (response.value == false) {
                        isCurrentPasswordCorrect = false;
                        $("#incorrectPwd").show().val('Incorrect Password');
                        $("#incorrectPwd").focus();
                    }
                    else {
                        isCurrentPasswordCorrect = true;
                        $("#incorrectPwd").hide();
                    }

                } else {
                    console.log("Something went wrong");
                }
            },
            complete: function (response) {
                showLoader(false);
            },
            failure: function (response) {
                console.log(response.responseText);
            },
            error: function (response) {
                console.log(response.responseText);
            }
        });
    }
    catch (err) {

    }
}

function SubmitNewPassword() {
    try {
        if (isCurrentPasswordCorrect == true && isNewAndOldPasswordMatch == false && isConfirmPasswordMatch == true) {
            if ($("#pbar").text() == 'Strong' || $("#pbar").text() == 'Extra Strong') {
                UpdateNewPassword();
            }

        }

    }
    catch (err) {
        console.log(err);
    }

}

function UpdateNewPassword() {
    try {
        showLoader(true);
        var userId = $("#hdnUserId").val();
        var pwd = $("#password-input").val().trim();
        $.ajax({
            type: "GET",
            url: "/Home/UpdateNewPassword",
            data: { userId: parseInt(userId), pwd: pwd },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null) {
                    if (response.success == false) {
                        $('#modal-password').modal('hide');
                        //BackgoudnDismissAlert('Failed!', 'Something Went Wrong');
                        MessageBox('Error!', 'fa fa-times', 'Something went wrong! Please try later', 'red', 'btn btn-danger', 'OKAY');


                    }
                    else {
                        $('#modal-password').modal('hide');
                        //BackgoudnDismissAlert('Success!', 'Password has been changed');
                        MessageBox('Success!', 'fa fa-check', 'Password has been changed', 'green', 'btn btn-success', 'Okay');

                    }

                } else {
                    console.log("Something went wrong");
                }
            },
            complete: function (response) {
                showLoader(false);
            },
            failure: function (response) {
                console.log(response.responseText);
            },
            error: function (response) {
                console.log(response.responseText);
            }
        });
    }
    catch (err) {

    }
}
function ResetPwd() {
    $("#Oldpassword-input").val('');
    $("#password-input").val('');
    $("#Confirmpassword-input").val('');
    isNewAndOldPasswordMatch = false;
    isConfirmPasswordMatch = false;
    isCurrentPasswordCorrect = false;
    $("#incorrectConfirmPwd").hide();
    $("#incorrectNewPwd").hide();
    $("#incorrectPwd").hide();

}


function MessageBox(title, icon, content, type, btnClass, btnText) {
    $.confirm({
        title: title,
        icon: icon,
        content: content,
        type: type,
        //  theme:'dark',
        buttons: {
            omg: {
                text: btnText,
                btnClass: btnClass,
            },
        }
    });
}

function BackgoudnDismissAlert(title,message,) {
    try {
        $.alert({
            title: title,
            content: message,
            animation: 'scale',
            closeAnimation: 'bottom',
            backgroundDismiss: true,
            buttons: {
                okay: {
                    text: 'okay',
                    btnClass: 'btn-blue',
                    action: function () {
                        // do nothing
                    }
                }
            }
        });
    }
    catch (err) {
        alert(err);
    }
}

function showLoader(val) {
    try {
        if (val == true) {
            $("body").addClass("loading");
        }
        else {
            $("body").removeClass("loading");
        }
    }
    catch (err) {
        console.log(err);
    }
}
