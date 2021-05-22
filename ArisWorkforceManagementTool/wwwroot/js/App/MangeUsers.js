var userId;
var isValidEmail = false;
$(document).ready(function () {
    $("#btnUpdate").hide();
    $("#btnSubmit").show();
    GetUsers();
    $("#txtUserName").focusout(function () {
        CheckNameExists();
    });
});
function CheckNameExists() {
    try {
        if ($("#txtUserName").val().trim().indexOf(' ') > 0) {
            showAlert({ title: "Warning!", message: 'User Name should not contain spance!', type: "WARNING" });
        }
        else {

            $.ajax({
                type: "GET",
                url: "/MasterPages/ManageUsers/IsUserNameExists",
                data: { UserName: $("#txtUserName").val().trim() },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response != null) {
                        if (response.value == true) {
                            $('#txtUserName').css('border-color', 'red');
                            showAlert({ title: "Warning!", message: 'User Name is already added!', type: "WARNING" });
                        }
                        else {
                            $('#txtUserName').css('border-color', 'green');

                        }

                    } else {
                        console.log("Something went wrong");
                    }
                },
                failure: function (response) {
                    console.log(response.responseText);
                },
                error: function (response) {
                    console.log(response.responseText);
                }
            });
        }
    }
    catch (err) {

    }
}
function SubmitRequest() {
    var userName = $("#txtUserName").val().trim();
    var emailAddress = $("#txtUserEmail").val().trim();
    var userType = $("#ddlUserType option:selected").val();
    var isActive = $("#ddlStatus option:selected").val();
    var fullName = $("#txtUserFullName").val().trim();
    var ProfileImage = $("#hdnProfilePicturePath").val();

    var data = {
        UserName: userName,
        MailAddress: emailAddress,
        UserTypeID: userType,
        IsActive: isActive,
        FullName: fullName,
        ProfileImage: ProfileImage
    };
    if (isValidEntry()) {
        callAjax('POST', '/MasterPages/ManageUsers/SubmitRequest', data);
        ResetFields();
        GetUsers();
    }
}
$('#tblUsers').on('click', 'td.edit', function (e) {
    e.preventDefault();
    $("#txtUserName").val(table.row(this).data()['userName']).attr('disabled', 'true');
    $("#txtUserFullName").val(table.row(this).data()['fullName']);
    $("#txtUserEmail").val(table.row(this).data()['mailAddress']);

    if (table.row(this).data()['isActive'] == 1) {
        $("#ddlStatus").val(1);
    }
    else {
        $("#ddlStatus").val(0);
    }
    $("#ddlUserType").val(table.row(this).data()['userTypeID']);
    userId = table.row(this).data()['userId'];

    $("#btnUpdate").show();
    $("#btnSubmit").hide();
});
function GetUsers() {
    $.ajax({
        type: "GET",
        url: "/MasterPages/ManageUsers/GetUsers",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null) {
                populateUsers(response);
            } else {
                console.log("Something went wrong");
            }
        },
        failure: function (response) {
            console.log(response.responseText);
        },
        error: function (response) {
            console.log(response.responseText);
        }
    });
}
function ResetFields() {
    $("#txtUserName").val('');
    $("#txtUserFullName").val('');
    $("#txtUserEmail").val('');
    $("#ddlStatus").val(-1);
    $("#ddlUserType").val(0);
    $("#txtUserName").attr("disabled", false);
    $('#txtUserName').css('border-color', '');
    $("#hdnProfilePicturePath").val('');
    $("#files").val('');
    $("#btnUpdate").hide();
    $("#btnSubmit").show();
    $('#txtUserName').css('border-color', '');
    $('#txtUserEmail').css('border-color', '');
    $('#ddlUserType').css('border-color', '');
    $('#ddlStatus').css('border-color', '');
    $('#txtUserFullName').css('border-color', '');

}
function UpdateUserRequest() {
    try {
        isValidEmail = true;
        var userName = $("#txtUserName").val().trim();
        var userFullName = $("#txtUserFullName").val().trim();
        var Useremail = $("#txtUserEmail").val().trim();
        var isActive = $("#ddlStatus option:selected").val();
        var userTypeId = $("#ddlUserType option:selected").val();
        var ProfileImage = $("#hdnProfilePicturePath").val();
        if (ProfileImage == '') {
            ProfileImage = null;

        }

        var data = {
            UserName: userName,
            FullName: userFullName,
            MailAddress: Useremail,
            IsActive: isActive,
            UserTypeID: userTypeId,
            UserId: userId,
            ProfileImage: ProfileImage
        };
        if (isValidEntry()) {
            callAjax('POST', '/MasterPages/ManageUsers/UpdateUser', data);
            ResetFields();
            GetUsers();
        }
    }
    catch (err) {
        console.log(err);
    }
}
function populateUsers(response) {
    table = $('#tblUsers').DataTable(
        {
            bLengthChange: true,
            bFilter: true,
            bSort: true,
            bPaginate: true,
            data: response,
            scrollY: false,
            crollX: false,
            select: true,
            //pageLength: 5,
            destroy: true,
            order: [[0, "desc"]],
            columns: [
                {
                    data: 'userId', title: 'User Id', visible: false,
                },
                {
                    data: 'userName', title: 'User Name'
                },
                {
                    data: 'fullName', title: 'Full Name'
                },
                {
                    data: 'userTypeID', title: 'Access Type',
                    render: function (data) {
                        if (data == 1) {
                            return 'Administrator';
                        }
                        else if (data == 2) {
                            return 'Manager';
                        }
                        else {
                            return "Report Viewer";
                        }
                    }
                },
                {
                    data: 'mailAddress', title: 'User Email'
                },
                {
                    data: 'isActive', title: 'Status',
                    render: function (data) {
                        if (data == 1) {
                            return 'Active';
                        }
                        else {
                            return 'Inactive';
                        }
                    }

                },
                {
                    data: null,
                    title: 'View',
                    class: 'edit',
                    defaultContent: '<button type="button" class="btn btn-success"><i class="fas fa-edit"></i></button>',
                    orderable: false
                }
            ]
        });

}
function uploadFiles(inputId) {
    var input = document.getElementById(inputId);
    var files = input.files;
    var formData = new FormData();
    for (var i = 0; i != files.length; i++) {
        formData.append("files", files[i]);
    }

    $.ajax(
        {
            url: "/MasterPages/ManageUsers/UploadImage",
            data: formData,
            processData: false,
            contentType: false,
            type: "POST",
            success: function (data) {
                $("#hdnProfilePicturePath").val(data.profileImagePath);
            }
        }
    );
}

function isValidEntry() {
    var valid = true;

    if ($('#txtUserName').val() == '') {
        $('#txtUserName').css('border-color', 'red');
        valid = false;
    }
    else {
        $('#txtUserName').css('border-color', '');
    }
    if ($("#txtUserEmail").val() == 0) {
        $('#txtUserEmail').css('border-color', 'red');
        valid = false;
    }
    else {
        $('#txtUserEmail').css('border-color', '');
    }
    if ($("#ddlUserType").val() == 0) {
        $('#ddlUserType').css('border-color', 'red');
        valid = false;
    }
    else {
        $('#ddlUserType').css('border-color', '');
    }
    if ($("#ddlStatus").val() == '') {
        $('#ddlStatus').css('border-color', 'red');
        valid = false;
    }
    else {
        $('#ddlStatus').css('border-color', '');
    }
    if ($("#txtUserFullName").val() == '') {
        $('#txtUserFullName').css('border-color', 'red');
        valid = false;
    }
    else {
        $('#txtUserFullName').css('border-color', '');
    }

    if (valid) {
        if (!isValidEmail) {
            valid = false;
        }
    }

    return valid;
}


$("#txtUserEmail").keyup(function () {
    try {
        var email = $("#txtUserEmail").val().trim();
        var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if (filter.test(email)) {
            isValidEmail = true;
            $("#txtUserEmail").css('border-color', '');
        }
        else {
            isValidEmail = false;
            $("#txtUserEmail").css('border-color', 'red');

        }
    }
    catch (err) {
        console.log(err);
    }
});