var glbEmpFilePath;
var table_passport;
var table_resident;
var table_remaining;

$(document).ready(function () {

    showLoader(true);
    $("#btnUpdate").hide();
    $("#btnSubmit").show();
    GetEmployeeReferenceNo();
    getCompanies();
    GetAllEmployees();

    GetAllUploads("PASSPORT", $("#txtEmployeeNumber").val().replace('ARIS-',''));
    GetAllUploads("RESIDENT", $("#txtEmployeeNumber").val().replace('ARIS-', ''));
    GetAllUploads("REMAINING", $("#txtEmployeeNumber").val().replace('ARIS-', ''));

    $("#txtPassportNumber").focusout(function () {
        CheckNameExists();
    });
   
});
function uploadFiles(inputId) {
    var input = document.getElementById(inputId);
    var files = input.files;
    var formData = new FormData();
    var empNo = $("#txtEmployeeNumber").val().trim();
    for (var i = 0; i != files.length; i++) {
        formData.append("files", files[i]);
    }
    formData.append("empNo", empNo);
    $.ajax(
        {
            url: "/MasterPages/ManageEmployees/UploadImage",
            //data: formData,
            data:  formData ,
            processData: false,
            contentType: false,
            type: "POST",
            async: false,
            success: function (data) {
                $("#hdnEmployeePicturePath").val(data.profileImagePath);
                $("#imgUser").attr('src', data.imageFullPath);
               
            }
        }
    );
}
function uploadDocuments(inputId) {
    var docId = inputId.split("_")[1];
    var input = document.getElementById(inputId);
    var files = input.files;
    var formData = new FormData();
    var empNo = $("#txtEmployeeNumber").val().trim();
    for (var i = 0; i != files.length; i++) {
        formData.append("files", files[i]);
    }
    formData.append("empNo", empNo);
    formData.append("docId", parseInt(docId));


    $.ajax(
        {
            url: "/MasterPages/ManageEmployees/UploadDocuments",
            data: formData,
            processData: false,
            contentType: false,
            type: "POST",
            async: false,
            success: function (data) {
                GetAllUploads("PASSPORT", empNo.replace('ARIS-',''));  // testing is in progress
                GetAllUploads("RESIDENT", empNo.replace('ARIS-', ''));
                GetAllUploads("REMAINING", empNo.replace('ARIS-', ''));
            }
        }
    );
}

function GetAllUploads(uType,empNo) {

    $.ajax({
        type: "GET",
        url: "/MasterPages/ManageEmployees/GetAllUploads",
        contentType: "application/json; charset=utf-8",
        data: { uploadType: uType, EmpRefNo: empNo },
        dataType: "json",
        success: function (response) {
            if (response != null) {
                if (uType == 'PASSPORT') {
                    populatePassport(response);
                }
                else if (uType == 'RESIDENT') {
                    populateResident(response);
                }
                else {
                    populateRemaining(response);
                }

            } else {
                // alert("Something went wrong");
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
function populatePassport(response) {
    var docId = 0;
    table_passport = $("#tblPassportFiles").DataTable(
        {
            bLengthChange: false,
            bFilter: true,
            bSort: true,
            bPaginate: true,
            data: response,
            scrollY: "650px",
            sScrollX: "100%",
            scrollCollapse: true,
            select: true,
            pageLength: 10,
            destroy: true,
            columns: [
                {
                    data: 'documentId', title: 'Document ID', visible: false,
                    render: function (data) {
                        if (data != null) { docId = data; }
                        return data;
                    }

                },
                {
                    data: 'filePath', title: 'File Path', visible: false,
                },
                {
                    data: 'documentName', title: 'Document Name',
                },
                {
                    data: 'fileName', title: 'File Name',
                    class:'download',
                    render: function (data) {
                        if (data == "No Files") {
                            return data;
                        }
                        else {
                            return '<a href="#" id="download_' + docId + '">' + data + '</a>';
                        }
                    }
                },
                {
                    data: null,
                    title: 'Upload',
                    class: 'upload',
                    render: function (data) {
                        if (isUploadAllowed) {
                            return '<input type="file" id="upload_' + docId + '" onchange="uploadDocuments(\'upload_' + docId + '\');">';
                        }
                        else {
                            return '<input type="file" id="upload_' + docId + '" disabled onchange="uploadDocuments(\'upload_' + docId + '\');">';

                        }
                    }
                }
            ]
        });

}
function populateResident(response) {
    var docId = 0;
    table_resident = $("#tblResidentFiles").DataTable(
        {
            bLengthChange: false,
            bFilter: true,
            bSort: true,
            bPaginate: true,
            data: response,
            scrollY: "650px",
            sScrollX: "100%",
            scrollCollapse: true,
            select: true,
            pageLength: 10,
            destroy: true,
            columns: [
                {
                    data: 'documentId', title: 'Document ID', visible: false,
                    render: function (data) {
                        if (data != null) { docId = data; }
                        return data;
                    }

                },
                {
                    data: 'filePath', title: 'File Path', visible: false,
                },
                {
                    data: 'documentName', title: 'Document Name',
                },
                {
                    data: 'fileName', title: 'File Name',
                    class: 'download',
                    render: function (data) {
                        if (data == "No Files") {
                            return data;
                        }
                        else {
                            return '<a href="#" id="download_' + docId + '">' + data + '</a>';                        }
                    }
                },
                {
                    data: null,
                    title: 'Upload',
                    class: 'upload',
                    render: function (data) {
                        if (isUploadAllowed) {
                            return '<input type="file" id="upload_' + docId + '" onchange="uploadDocuments(\'upload_' + docId + '\');">';
                        }
                        else {
                            return '<input type="file" id="upload_' + docId + '" disabled onchange="uploadDocuments(\'upload_' + docId + '\');">';
                        }
                    }
                }
            ]
        });

}
function populateRemaining(response) {
    var docId = 0;
    table_remaining = $("#tblRemainingFiles").DataTable(
        {
            bLengthChange: false,
            bFilter: false,
            bSort: false,
            bPaginate: false,
            data: response,
            scrollY: "650px",
            sScrollX: "100%",
            scrollCollapse: true,
            select: true,
            pageLength: 10,
            destroy: true,
            columns: [
                {
                    data: 'documentId', title: 'Document ID', visible: false,
                    render: function (data) {
                        if (data != null) { docId = data; }
                        return data;
                    }

                },
                {
                    data: 'filePath', title: 'File Path', visible: false,
                },
                {
                    data: 'documentName', title: 'Document Name',
                },
                {
                    data: 'fileName', title: 'File Name',
                    class: 'download',
                    render: function (data) {
                        if (data == "No Files") {
                            return data;
                        }
                        else {
                            return '<a href="#" id="download_' + docId + '">' + data + '</a>';
                        }
                    }
                },
                {
                    data: null,
                    title: 'Upload',
                    class: 'upload',
                    render: function (data) {
                        if (isUploadAllowed) {
                            return '<input type="file" id="upload_' + docId + '" onchange="uploadDocuments(\'upload_' + docId + '\');">';
                        }
                        else {
                            return '<input type="file" id="upload_' + docId + '" disabled onchange="uploadDocuments(\'upload_' + docId + '\');">';
                        }
                    }
                }
            ]
        });

}
function SubmitRequest() {
    var isYesClicked = false;
    var isValid = true;
    var employeeName = $("#txtEmployeeName").val();
    var employeeReferenceNo = parseInt($("#txtEmployeeNumber").val().replace('ARIS-', ''));
    var companyId = $("#ddlCompany option:selected").val();
    var nationality = $("#ddlCountry option:selected").val();
    var passportNumber = $("#txtPassportNumber").val();
    var passportExpiryDate = $("#dpPassportExpiryDate").val() != '' ? $("#dpPassportExpiryDate").datepicker('getDate').toLocaleString() : '';
    var residentNumber = $("#txtResidentNumber").val();
    var residentExpiryDate = $("#dpResidentExpiryDate").val() != '' ? $("#dpResidentExpiryDate").datepicker('getDate').toLocaleString() : '';
    var joiningDate = $("#dpJoiningDate").val() != '' ? $("#dpJoiningDate").datepicker('getDate').toLocaleString() : '';
    var contractStartDate = $("#dpContractStartDate").val() != '' ? $("#dpContractStartDate").datepicker('getDate').toLocaleString() : '';
    var contractEndDate = $("#dpContractEndDate").val() != '' ? $("#dpContractEndDate").datepicker('getDate').toLocaleString() : '';
    var gsm = $("#txtGsm").val();
    var accomodationDetails = $("#txtAccomodationDetails").val();
    var maritalStatus = $("input[name='radioMarital']:checked").val();
    var idProfession = $("#txtIdProfession").val();
    var designation = $("#txtDesignation").val();
    var bankName = $("#txtBankName").val();
    var bankAccountNumber = $("#txtAccountNumber").val();
    var remarks = $("#txtRemarks").val();
    var employeeImage = $("#hdnEmployeePicturePath").val();
    // employee image
    // file uploads

    var data = {
        EmployeeName: employeeName,
        EmployeeReferenceNo: employeeReferenceNo,
        CompanyId: companyId,
        Nationality: nationality,
        PassportNumber: passportNumber,
        PassportExpiryDate: passportExpiryDate,
        ResidentNumber: residentNumber,
        ResidentExpiryDate: residentExpiryDate,
        JoiningDate: joiningDate,
        ContractStartDate: contractStartDate,
        ContractEndDate: contractEndDate,
        Gsm: gsm,
        AccomodationDetails: accomodationDetails,
        MaritalStatus: maritalStatus,
        IdProfession: idProfession,
        Designation: designation,
        BankName: bankName,
        BankAccountNumber: bankAccountNumber,
        Remarks: remarks,
        EmployeeImage: employeeImage
    };

    isValid = isValidEntry();
    if (isValid) {
        if ($("#txtConfirmAccountNumber").val().trim() == $("#txtAccountNumber").val().trim()) {

            showLoader(true);
            callAjax('POST', '/MasterPages/ManageEmployees/SubmitRequest', data);
            GetAllEmployees();
            ClearFields();
        }
    }
    else {
    }
}
function UpdateRequest() {
    var isValid = true;
    var employeeName = $("#txtEmployeeName").val();
    var employeeReferenceNo = parseInt($("#txtEmployeeNumber").val().replace('ARIS-', ''));
    var companyId = $("#ddlCompany option:selected").val();
    var nationality = $("#ddlCountry option:selected").val();
    var passportNumber = $("#txtPassportNumber").val();
    var passportExpiryDate = $("#dpPassportExpiryDate").val() != '' ? $("#dpPassportExpiryDate").datepicker('getDate').toLocaleString() : '';
    var residentNumber = $("#txtResidentNumber").val();
    var residentExpiryDate = $("#dpResidentExpiryDate").val() != '' ? $("#dpResidentExpiryDate").datepicker('getDate').toLocaleString() : '';
    var joiningDate = $("#dpJoiningDate").val() != '' ? $("#dpJoiningDate").datepicker('getDate').toLocaleString() : '';
    var contractStartDate = $("#dpContractStartDate").val() != '' ? $("#dpContractStartDate").datepicker('getDate').toLocaleString() : '';
    var contractEndDate = $("#dpContractEndDate").val() != '' ? $("#dpContractEndDate").datepicker('getDate').toLocaleString() : '';
    var gsm = $("#txtGsm").val();
    var accomodationDetails = $("#txtAccomodationDetails").val();
    var maritalStatus = $("input[name='radioMarital']:checked").val();
    var idProfession = $("#txtIdProfession").val();
    var designation = $("#txtDesignation").val();
    var bankName = $("#txtBankName").val();
    var bankAccountNumber = $("#txtAccountNumber").val();
    var remarks = $("#txtRemarks").val();
    var employeeImage = $("#hdnEmployeePicturePath").val() == '' ? null : $("#hdnEmployeePicturePath").val();
    // file uploads
    //console.log(employeeImage + ' - empimg');
    var data = {
        EmployeeName: employeeName,
        EmployeeNo: empNO,
        CompanyId: companyId,
        Nationality: nationality,
        PassportNumber: passportNumber,
        PassportExpiryDate: passportExpiryDate,
        ResidentNumber: residentNumber,
        ResidentExpiryDate: residentExpiryDate,
        JoiningDate: joiningDate,
        ContractStartDate: contractStartDate,
        ContractEndDate: contractEndDate,
        Gsm: gsm,
        AccomodationDetails: accomodationDetails,
        MaritalStatus: maritalStatus,
        IdProfession: idProfession,
        Designation: designation,
        BankName: bankName,
        BankAccountNumber: bankAccountNumber,
        Remarks: remarks,
        EmployeeReferenceNo: employeeReferenceNo,
        EmployeeImage: employeeImage
    };
    isValid = isValidEntry();
    if (isValid) {
        showLoader(true);
        callAjax('POST', '/MasterPages/ManageEmployees/UpdateRequest', data);
        GetAllEmployees();
        ClearFields();
    }
    else {
    }
}
///code to remove unwanted files from table
function deleteInvalidUploads() {
    var userId = 1; //need to automate it
    var empNo = $("#txtEmployeeNumber").val().trim();
    $.ajax({
        type: "GET",
        url: "/MasterPages/ManageEmployees/DeleteInValidUploads",
        contentType: "application/json; charset=utf-8",
        data: { empNo: empNo, userId:userId },
        dataType: "json",
        success: function (response) {
            if (response != null) {

                GetAllUploads("PASSPORT", empNo.replace('ARIS-',''));
                GetAllUploads("RESIDENT", empNo.replace('ARIS-', ''));
                GetAllUploads("REMAINING", empNo.replace('ARIS-', ''));


            } else {
                // alert("Something went wrong");
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
//download function for passport files
$('#tblPassportFiles').on('click', 'td.download', function(e) {
    e.preventDefault();
    try {
        var filePath = table_passport.row(this).data()['filePath'];
        var link = document.createElement('a');
        link.href = filePath;
        link.download = filePath.substr(filePath.lastIndexOf('/') + 1);
        link.click();
    }
    catch (err) {
        console.log(err);
    }
});
//download function for Resident Card files
$('#tblResidentFiles').on('click', 'td.download', function(e) {
    e.preventDefault();
    try {
        var filePath = table_resident.row(this).data()['filePath'];
        var link = document.createElement('a');
        link.href = filePath;
        link.download = filePath.substr(filePath.lastIndexOf('/') + 1);
        link.click();
    }
    catch (err) {
        console.log(err);
    }
});
//download function for Remining uploads
$('#tblRemainingFiles').on('click', 'td.download', function(e) {
    e.preventDefault();
    try {
        var filePath = table_remaining.row(this).data()['filePath'];
        var link = document.createElement('a');
        link.href = filePath;
        link.download = filePath.substr(filePath.lastIndexOf('/') + 1);
        link.click();
    }
    catch (err) {
        console.log(err);
    }
});
///Enable?Disable Radiobutton Group
function disableRadioButtonGroup(val) {
    if (val) {
        $("input[name='radioMarital']").each(function (i) {
            $(this).attr('disabled', 'disabled');
        });
    }
    else {
        $("input[name='radioMarital']").each(function (i) {
            $(this).attr('disabled', false);
        });
    }
}
//is confirm box clicked
$('.example-p-2').on('click', function () {
    $.confirm({
        title: 'Are you sure?',
        content: 'Are you sure that you want to submit the details to next level',
        icon: 'fa fa-question-circle',
        animation: 'scale',
        closeAnimation: 'scale',
        opacity: 0.5,
        buttons: {
            'confirm': {
                text: 'Yes',
                btnClass: 'btn-blue',
                action: function () {
                    //$.alert('you clicked on <strong>Yes</strong>');
                    SubmitRequest();
                }
            },
            cancel: function () {
            },
        }
    });
});
$('.example-p-1').on('click', function () {
    $.confirm({
        title: 'Are you sure?',
        content: 'Are you sure that you want to submit the details to next level',
        icon: 'fa fa-question-circle',
        animation: 'scale',
        closeAnimation: 'scale',
        opacity: 0.5,
        buttons: {
            'confirm': {
                text: 'Yes',
                btnClass: 'btn-blue',
                action: function () {
                    //$.alert('you clicked on <strong>Yes</strong>');
                    UpdateRequest();
                }
            },
            cancel: function () {
            },
        }
    });
});

function CheckNameExists() {
    try {
        showLoader(true);
        $.ajax({
            type: "GET",
            url: "/MasterPages/ManageEmployees/IsEmployeeNameExists",
            data: { passportNumber: $("#txtPassportNumber").val().trim() },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null) {
                    if (response.value == true) {
                        //$('#txtCompanyName').css('border-color', 'red');
                        showAlert({ title: "Warning!", message: 'An employee is exists with same passport number!', type: "WARNING" });
                    }
                    else {
                       // $('#txtCompanyName').css('border-color', '');

                    }

                } else {
                    alert("Something went wrong");
                }
            },
            complete: function (response) {
                showLoader(false);
            },
            failure: function (response) {
                alert(response.responseText);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }
    catch (err) {

    }
}

function clearValidationCSS() {
    $('#txtEmployeeName').css('border-color', '').attr('disabled', false);
    $('#ddlCompany').css('border-color', '').attr('disabled', false);
    $('#ddlCountry').css('border-color', '').attr('disabled', false);
    $('#txtPassportNumber').css('border-color', '').attr('disabled', false);
    $('#dpPassportExpiryDate').css('border-color', '').attr('disabled', false);
    $('#txtResidentNumber').css('border-color', '').attr('disabled', false);
    $('#dpResidentExpiryDate').css('border-color', '').attr('disabled', false);
    $('#dpJoiningDate').css('border-color', '').attr('disabled', false);
    $('#dpContractStartDate').css('border-color', '').attr('disabled', false);
    $('#dpContractEndDate').css('border-color', '').attr('disabled', false);
    $('#txtGsm').css('border-color', '').attr('disabled', false);
    $('#txtAccomodationDetails').css('border-color', '').attr('disabled', false);
    $('#txtIdProfession').css('border-color', '').attr('disabled', false);
    $('#txtDesignation').css('border-color', '').attr('disabled', false);
    $('#txtBankName').css('border-color', '').attr('disabled', false);
    $('#txtAccountNumber').css('border-color', '').attr('disabled', false);
    $('#txtConfirmAccountNumber').css('border-color', '').attr('disabled', false);
    $('#txtRemarks').css('border-color', '').attr('disabled', false);

}

$("#txtConfirmAccountNumber").keyup(function () {
    try {
        if ($("#txtAccountNumber").val().trim() != '') {
            if ($("#txtAccountNumber").val().trim() == $("#txtConfirmAccountNumber").val().trim()) {
                $("#spanConfirmAccount").text('').css('color', '');
            }
            else {
                $("#spanConfirmAccount").text('Account number is not matching').css('color', 'red');
            }
        }
    }
    catch (err) {
        console.log(err);
    }
});
$("#txtAccountNumber").keyup(function () {
    try {
        if ($("#txtConfirmAccountNumber").val().trim() != '') {
            if ($("#txtAccountNumber").val().trim() == $("#txtConfirmAccountNumber").val().trim()) {
                $("#spanConfirmAccount").text('').css('color', '');
            }
            else {
                $("#spanConfirmAccount").text('Account number is not matching').css('color', 'red');
            }
        }
    }
    catch (err) {
        console.log(err);
    }
});