
var row;
var table;
var companyId;
var isValidCompany = false;
$(document).ready(function () {
    $("#btnUpdate").hide();
    $("#btnSubmit").show();
    //showAlert({ title: "SUCCESS!", message: 'Action has been completed successfully!', type: "SUCCESS" });
    GetAllCompanies();

    $("#txtCompanyName").focusout(function () {
        if ($("#txtCompanyLocation").val().trim() != '' && $("#txtCompanyName").val().trim() != '') {
            CheckNameExists();
        }
    });
    $("#txtCompanyLocation").focusout(function () {
        if ($("#txtCompanyName").val().trim() != '' && $("#txtCompanyLocation").val().trim() != '') {
            CheckNameExists();
        }
    });

    $('#tblCompanies').on('click', 'td.edit', function (e) {
        e.preventDefault();
        ResetClientFields();
        $("#txtCompanyName").val(table.row(this).data()['companyName']);
        $("#txtCompanyName").attr("disabled", "disabled");
        $("#txtCompanyLocation").attr("disabled", "disabled");
        $("#txtCompanyServices").val(table.row(this).data()['companyServices']);
        if (table.row(this).data()['isActive'] == 1) {
            $("#ddlStatus").val(1);
        }
        else {
            $("#ddlStatus").val(0);
        }
        $("#txtCompanyLocation").val(table.row(this).data()['companyLocation'])
        companyId = table.row(this).data()['companyId'];

        $("#btnUpdate").show();
        $("#btnSubmit").hide();
        $(window).scrollTop(0);

    });

    //validation


    //ready end
});
function CheckNameExists() {
    try {
        showLoader(true);
        $.ajax({
            type: "GET",
            url: "/MasterPages/ManageCompany/IsCompanyNameExists",
            data: { CompanyName: $("#txtCompanyName").val().trim(), CompanyLocation: $("#txtCompanyLocation").val().trim() },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null) {
                    if (response.value == true) {
                        $('#txtCompanyName').css('border-color', 'red');
                        //showAlert({ title: "Warning!", message: 'Company Name is already added!', type: "WARNING" });
                        MessageBox('Exists!', 'fa fa-map-marker', 'Client & Location is already added!', 'orange', 'btn btn-warning', 'Okey');
                        isValidCompany = false;
                    }
                    else {
                        isValidCompany = true;
                        $('#txtCompanyName').css('border-color', '');

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
function SubmitRequest() {
    var companyName = $("#txtCompanyName").val().trim();
    var companyServices = $("#txtCompanyServices").val().trim();
    var isActive = $("#ddlStatus option:selected").val();
    var companyLocation = $("#txtCompanyLocation").val().trim();
    var data = {
        CompanyName: companyName,
        CompanyServices: companyServices,
        IsActive: isActive,
        CompanyLocation: companyLocation
    };



    if (isValidEntry()) {
        showLoader(true);
        callAjax('POST', '/MasterPages/ManageCompany/SubmitRequest', data);
        GetAllCompanies();
        ResetClientFields()
    }
    else {

    }



}
function UpdateRequest() {

    try {
        var companyName = $("#txtCompanyName").val().trim();
        var companyServices = $("#txtCompanyServices").val().trim();
        var isActive = $("#ddlStatus option:selected").val();
        var companyLocation = $("#txtCompanyLocation").val().trim();

        var data = {
            CompanyName: companyName,
            CompanyServices: companyServices,
            IsActive: isActive,
            companyId: companyId,
            CompanyLocation: companyLocation
        };


        isValidCompany = true;

        if (isValidEntry()) {
            showLoader(true);
            callAjax('POST', '/MasterPages/ManageCompany/UpdateRequest', data);
            GetAllCompanies();
            ResetClientFields();
        }

    }
    catch (err) {
        console.log(err);
    }
}
//Fetch all data
function GetAllCompanies() {
    showLoader(true);
    $.ajax({
        type: "GET",
        url: "/MasterPages/ManageCompany/GetAllCompanies",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () { // Before we send the request, remove the .hidden class from the spinner and default to inline-block.
            // $('#modal-Loader').modal('show');
        },
        success: function (response) {
            if (response != null) {
                populateCompanies(response);
                // $('#modal-Loader').modal('hide');
            } else {
                alert("Something went wrong");
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
function populateCompanies(response) {
    table = $('#tblCompanies').DataTable(
        {
            bLengthChange: true,
            bFilter: true,
            bSort: true,
            bPaginate: true,
            data: response,
            scrollY: false,
            select: true,
            pageLength: 5,
            destroy: true,
            order: [[1, "desc"]],
            //columnDefs: [ { "visible": false,  "targets": [ 0 ] }],
            columns: [
                {
                    data: null,
                    title: 'View',
                    class: 'edit',
                    defaultContent: '<button type="button" class="btn btn-sm btn-success"><i class="fas fa-edit"></i></button>',
                    orderable: false
                },
                {
                    data: 'companyId', title: 'Company ID', visible: false,
                },
                {
                    data: 'companyName', title: 'Client Name'
                },
                {
                    data: 'companyLocation', title: 'Client Location'
                },
                {
                    data: 'companyServices', title: 'Services'
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

            ]
        });

}

function ResetClientFields() {
    try {
        $("#txtCompanyName").val('');
        $("#txtCompanyServices").val('');
        $("#txtCompanyLocation").val('');
        $("#ddlStatus").val(-1);
        $('#ddlStatus').css('border-color', '');
        $("#txtCompanyName").attr("disabled", false);
        $('#txtCompanyName').css('border-color', '');
        $("#txtCompanyLocation").attr("disabled", false);
        $("#txtCompanyLocation").css('border-color', '');
        $("#btnUpdate").hide();
        $("#btnSubmit").show();
    }
    catch (err) {
        console.log(err);
    }
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


function isValidEntry() {
    var valid = true;
    var message = '';
    var count = 0;

    if ($('#txtCompanyName').val() == '') {
        $('#txtCompanyName').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Clien Name </br>';
    }
    else {
        $('#txtCompanyName').css('border-color', '');
    }
    if ($("#txtCompanyLocation").val() == '') {
        $('#txtCompanyLocation').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Company Location </br>';
    }
    else {
        $('#txtCompanyLocation').css('border-color', '');
    }
    if ($("#ddlStatus").val() == -1) {
        $('#ddlStatus').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Status </br>';
    }
    else {
        $('#ddlStatus').css('border-color', '');
    }
    if (!isValidCompany) {
        $('#txtCompanyName').css('border-color', 'red');
        $('#txtCompanyName').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Valid Client with location </br>';

    }
    else {
        $('#txtCompanyName').css('border-color', '');
        $('#txtCompanyName').css('border-color', '');
    }
    if (message != '') {
        MessageBox('Required!', 'fa fa-warning', message, 'red', 'btn btn-danger', 'Okey');
        valid = false;
        message = '';
        count = 0;
    }
    else {
        valid = true;
    }
    return valid;
}
$("#txtCompanyName").keyup(function () {
    if ($("#txtCompanyName").val() != '') {
        $('#txtCompanyName').css('border-color', '');

    }
});
$("#txtCompanyLocation").keyup(function () {
    if ($("#txtCompanyLocation").val() != '') {
        $('#txtCompanyLocation').css('border-color', '');

    }
});
$("#ddlStatus").keyup(function () {
    if ($("#ddlStatus option:selected").val() != -1) {
        $('#ddlStatus').css('border-color', '');

    }
});

