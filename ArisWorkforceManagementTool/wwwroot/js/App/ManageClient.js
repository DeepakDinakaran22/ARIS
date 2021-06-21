
var row;
var table;
var companyId;
var isValidCompany = false;
var counter = 1000;
var tbl_docUpload;
var isValidEmail = false;
$(document).ready(function () {
    $("#dpCompanyExpiry").datepicker({ minDate: 0 }); //maxDate: "+1M +15D" });
    $("#div_clientUploads").hide();
    getCompanies();

    $("#btnUpdate").hide();
    $("#btnSubmit").show();
    //showAlert({ title: "SUCCESS!", message: 'Action has been completed successfully!', type: "SUCCESS" });
    GetAllCompanies();
    $('.nav li a').click(function () {
        ResetClientFields();

    });
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
        $("#dpCompanyExpiry").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['companyExpiry'].replace('T00:00:00', '')));
        $("#txtCompanyPhone").val(table.row(this).data()['companyPhone']);
        $("#txtCompanyEmail").val(table.row(this).data()['companyEmail']);

        companyId = table.row(this).data()['companyId'];

        $("#btnUpdate").show();
        $("#btnSubmit").hide();
        $(window).scrollTop(0);

    });

    //validation


    //ready end
});
$("#ddlCompany").change(function () {
    if ($("#ddlCompany option:selected").val() == 0) {
        $("#div_clientUploads").hide();
    }
    else {
        GetAllUploads();
        $("#div_clientUploads").show();
    }

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
    var expiry = $("#dpCompanyExpiry").val() != '' ? $("#dpCompanyExpiry").datepicker('getDate').toLocaleString() : null;
    var phone = $("#txtCompanyPhone").val().trim();
    var email = $("#txtCompanyEmail").val().trim();

    var data = {
        CompanyName: companyName,
        CompanyServices: companyServices,
        IsActive: isActive,
        CompanyLocation: companyLocation,
        CompanyExpiry: expiry,
        CompanyPhone: phone,
        CompanyEmail : email
    };



    if (isValidEntry()) {
        showLoader(true);
        callAjax('POST', '/MasterPages/ManageCompany/SubmitRequest', data);
        GetAllCompanies();
        ResetClientFields();
        getCompanies();
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
        var expiry = $("#dpCompanyExpiry").val() != '' ? $("#dpCompanyExpiry").datepicker('getDate').toLocaleString() : null;
        var phone = $("#txtCompanyPhone").val().trim();
        var email = $("#txtCompanyEmail").val().trim();

        var data = {
            CompanyName: companyName,
            CompanyServices: companyServices,
            IsActive: isActive,
            companyId: companyId,
            CompanyLocation: companyLocation,
            CompanyExpiry: expiry,
            CompanyPhone: phone,
            CompanyEmail: email
        };


        isValidCompany = true;

        if (isValidEntry()) {
            showLoader(true);
            callAjax('POST', '/MasterPages/ManageCompany/UpdateRequest', data);
            GetAllCompanies();
            ResetClientFields();
            getCompanies();
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
            bLengthChange: false,
            bFilter: true,
            bSort: true,
            bPaginate: true,
            data: response,
            scrollX: false,
            scrollY: true,
            select: true,
            pageLength: 10,
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
                    data: 'companyExpiry', title: 'Expiry',
                    render: function (data) {
                        if (data != null) {
                            return data.replace('T00:00:00', '');
                        }
                        else { return null; }
                    }
                },
                {
                    data: 'companyPhone', title: 'Phone'
                },
                {
                    data: 'companyEmail', title: 'E-Mail'
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
        $("#txtCompanyEmail").val('').css('border-color', '');
        $("#txtCompanyPhone").val('').css('border-color', '');
        $("#dpCompanyExpiry").val('').css('border-color', '');
        $("#btnUpdate").hide();
        $("#btnSubmit").show();

        $("#div_clientUploads").hide();
        $("#ddlCompany").val(0);

        isValidCompany = false;
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
    if ($("#dpCompanyExpiry").val() == '') {
        $('#dpCompanyExpiry').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Expiry Date </br>';
    }
    else {
        $('#dpCompanyExpiry').css('border-color', '');
    }
    if ($("#txtCompanyPhone").val() == '') {
        $('#txtCompanyPhone').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Phone </br>';
    }
    else {
        $('#txtCompanyPhone').css('border-color', '');
    }
    if ($("#txtCompanyEmail").val() == '') {
        $('#txtCompanyEmail').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Email </br>';
    }
    else {
        $('#txtCompanyEmail').css('border-color', '');
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
    checkEmail();
    if (!isValidEmail) {
        $("#txtCompanyEmail").css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Valid Email ID </br>';
    }
    else {
        // $("#txtUserEmail").css('border-color', '');

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
$("#ddlStatus").change(function () {
    if ($("#ddlStatus option:selected").val() != -1) {
        $('#ddlStatus').css('border-color', '');

    }
});
$("#txtCompanyPhone").keyup(function () {
    if ($("#txtCompanyPhone").val() != '') {
        $('#txtCompanyPhone').css('border-color', '');

    }
});

$("#txtCompanyEmail").keyup(function () {
    if ($("#txtCompanyEmail").val() != '') {
        $('#txtCompanyEmail').css('border-color', '');

    }
});

$("#dpCompanyExpiry").change(function () {
    if ($("#dpCompanyExpiry").val() != '') {
        $('#dpCompanyExpiry').css('border-color', '');

    }
});



function GetAllUploads() {

    $.ajax({
        type: "GET",
        url: "/MasterPages/ManageCompany/GetAllUploads",
        contentType: "application/json; charset=utf-8",
        data: { companyId: $("#ddlCompany option:selected").val() },
        dataType: "json",
        success: function (response) {
            if (response != null) {
                pupulateUploadDocs(response);
            } else {

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
function pupulateUploadDocs(response) {
    var docId = 0;
    var companyId = 0;
    var hasFile = false;
    var upldId = 0;
    var isExpReq = 0;

    tbl_docUpload = $("#tblUploadDocs").DataTable(
        {
            bLengthChange: false,
            bFilter: false,
            bSort: false,
            bPaginate: false,
            bInfo: false,
            data: response,
            ScrollX: false,
            select: false,
            pageLength: 10,
            destroy: true,
            columns: [
                {
                    data: 'docFileUploadId', visible: false,
                    render: function (data) {
                        upldId = data;
                        return data;
                    }
                },
                {
                    data: 'documentId', title: 'Document ID', visible: false,
                    render: function (data) {
                        if (data != null) {
                            docId = data;
                        }
                        return data;
                    }

                },
                {
                    data: 'companyId', title: 'Document ID', visible: false,
                    render: function (data) {
                        if (data != null) {
                            companyId = data;
                        }
                        return data;
                    }

                },
                {
                    data: 'filePath', title: 'File Path', visible: false,
                },
                {
                    data: 'documentName', title: 'Document Name', visible: true,
                },

                {
                    data: 'fileName', title: 'File Name', visible: true,
                    class: 'download',
                    render: function (data) {
                        if (data == "No Files") {
                            hasFile = false;
                            return data;
                        }
                        else {
                            hasFile = true;
                            return '<a href="#" id="download_' + docId + '">' + data + '</a>';
                        }
                    }
                },
                {
                    data: 'isMandatory', title: 'Mandatory', visible: false,
                    render: function (data) {
                        if (data == 1) {
                            return 'Yes';
                        }
                        else {
                            return 'No';
                        }
                    }
                },
                {
                    data: 'isExpiryRequired', title: 'test', visible: false,
                    render: function (data) {
                        isExpReq = data;
                        return data;
                    }
                },
                {
                    data: 'companyExpiry', title: 'Expiry', visible: true,
                    render: function (data) {
                        var eDate;
                        if (isExpReq == 1) {
                            if (data != null) {
                                console.log(data + '--------');
                                eDate = data;
                            }
                            return '<input type="date"  value="' + eDate + '"  class="form - control expiry" id="dp_' + docId  + '" style="width: 132px; font - size: smaller; " >';
                        }
                        else {
                            return '<input type="text" value="No Expiry Required" disabled class="form-control expiry" id="dp_' + docId + '" style="width:132px;font-size:smaller;" >';
                            //return 'No Expiry';
                        }
                    }
                },
                {
                    data: null,
                    title: 'Upload',
                    class: 'upload',
                    render: function (data) {
                        if (hasFile == false) {
                            return '<input type="file"  id="upload_' + docId + '" onchange="uploadDocuments(\'upload_' + docId  + '\');">';
                        }
                        else {
                            return '<input type="file" id="upload_' + docId + '" disabled onchange="uploadDocuments(\'upload_' + docId  + '\');">';

                        }
                    }
                },
                {
                    data: null, title: 'Delete',
                    class: 'delete',
                    render: function (data) {
                        if (hasFile == false) {
                            return '<a href="#" hidden onclick="DeleteSelectedFiles(\'delete_' + upldId + '\');" id="delete_' + upldId + '"> Delete </a>';
                        }
                        else {
                            return '<a href="#" onclick="DeleteSelectedFiles(\'delete_' + upldId + '\');" id="delete_' + upldId + '"> Delete </a>';
                        }
                    }
                },
                
            ]
        });

}

function getCompanies() {
    try {

        bindDropDownList('ddlCompany', 'GET', '/MasterPages/ManageEmployees/GetCompanies', 'json', 'companyId', 'companyName');

    }
    catch (err) {
        console.log(err);
    }
}

function uploadDocuments(inputId) {

    var docId = inputId.split("_")[1];
    var companyId = $("#ddlCompany option:selected").val();
    var input = document.getElementById(inputId);

    var dpName = 'dp_' + docId;
    if ($("#" + dpName + "").val().trim() == 'No Expiry Required' || $("#" + dpName + "").val().trim() != '') {
        var files = input.files;
        var formData = new FormData();
        for (var i = 0; i != files.length; i++) {
            formData.append("files", files[i]);
        }
        formData.append("companyId", parseInt(companyId));
        formData.append("docId", parseInt(docId));
        formData.append("expDate", $("#" + dpName + "").val().trim());
        $.ajax(
            {
                url: "/MasterPages/ManageCompany/UploadDocumentsClients",
                data: formData,
                processData: false,
                contentType: false,
                type: "POST",
                async: false,
                success: function (data) {
                    ToastPopups('SUCCESS','Selected document has been uploaded!');

                    GetAllUploads();
                }
            }
        );
    }
    else {
        $("#" + inputId + "").val(null);
        MessageBox('Required!', 'fa fa-times', 'Expiry date!', 'red', 'btn btn-danger', 'Okey');

    }
}
$('#tblUploadDocs').on('click', 'td.download', function (e) {
    e.preventDefault();
    try {
        var filePath = tbl_docUpload.row(this).data()['filePath'];
        if (filePath != 'No Path') {
            var link = document.createElement('a');
            link.href = filePath;
            link.download = filePath.substr(filePath.lastIndexOf('/') + 1);
            link.click();
        }
       
    }
    catch (err) {
        console.log(err);
    }
});

function ToastPopups(type,title) {
    var Toast = Swal.mixin({
        toast: true,
        position: 'middle',
        showConfirmButton: false,
        timer: 3000
    });

    if (type == 'SUCCESS') {
        Toast.fire({
            icon: 'success',
            title: title
        })
    }
    else {
        Toast.fire({
            icon: 'error',
            title: title,
            
        })
    }
}
function DeleteSelectedFiles(inputId) {
    var uploadedId = inputId.split('_')[1];
    $.confirm({
        title: 'Are you sure?',
        content: 'Want to delete  the file permanently ?',
        icon: 'fa fa-question-circle',
        animation: 'scale',
        closeAnimation: 'scale',
        opacity: 0.5,
        buttons: {
            'confirm': {
                text: 'Yes',
                btnClass: 'btn-blue',
                action: function () {
                    DeleteSelectedUploads(uploadedId);
                }
            },
            cancel: function () {
            },
        }
    });

}
function DeleteSelectedUploads(id) {
    var uploadFileId = id;
    $.ajax({
        type: "GET",
        url: "/MasterPages/ManageCompany/DeleteSelectedFiles",
        contentType: "application/json; charset=utf-8",
        data: { docUploadId: uploadFileId },
        dataType: "json",
        async: false,
        success: function (response) {
            if (response != null) {
                MessageBox('Deleted !', 'fa fa-times', 'Selected file has been deleted!', 'green', 'btn btn-success', 'Okey');

            } else {
            }
        },
        failure: function (response) {
            MessageBox('Error!', 'fa fa-times', 'Something went wrong', 'red', 'btn btn-danger', 'Okey');

        },
        error: function (response) {
            console.log(response.responseText);
        }
    });
    GetAllUploads();
}

$("#txtCompanyEmail").keyup(function () {
    checkEmail();
});

function checkEmail() {
    try {
        var email = $("#txtCompanyEmail").val().trim();
        var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if (filter.test(email)) {
            isValidEmail = true;
            //$("#txtUserEmail").css('border-color', '');
        }
        else {
            isValidEmail = false;
            //$("#txtUserEmail").css('border-color', 'red');

        }
    }
    catch (err) {
        console.log(err);
    }
}