﻿var glbEmpFilePath;
var table_passport;
var table_resident;
var table_remaining;
var userRole;
var loggedInUserId;
var row;
var table;
var empNO;
var approvalStatusId;
var isUploadAllowed = true;
var cnt = 0;
var today;
var tbl_docUpload;
var passportN = '';
$(document).ready(function () {
    $("#div_confidential").hide();
    var d = new Date();
    today = moment(new Date()).format('YYYY-MM-DD');
    showLoader(true);
    userRole = $("#hdnUserRole").val();
    loggedInUserId = $("#hdnUserId").val();
  
    $("#contractEndDate").datetimepicker({ minDate: 0, format: 'L' }); //maxDate: "+1M +15D" });
    $("#contractStartDate").datetimepicker({ minDate: 0, format: 'L'   });
    $("#joiningDate").datetimepicker({ minDate: 0, format: 'L'   });
    $("#residentExpiryDate").datetimepicker({ minDate: 0, format: 'L' });
    $("#passportDate").datetimepicker({ minDate: 0, format: 'L' });
    

    $("#btnUpdate").hide();
    $("#btnSubmit").show();
    $("#btnSendBack").hide();
    $("#btnApprove").hide();
    GetEmployeeReferenceNo();
    getCompanies();
    GetAllEmployees();

    GetAllUploads("PASSPORT", $("#txtEmployeeNumber").val().replace('ARIS-',''));
    GetAllUploads("RESIDENT", $("#txtEmployeeNumber").val().replace('ARIS-', ''));
    GetAllUploads("REMAINING", $("#txtEmployeeNumber").val().replace('ARIS-', ''));

    if (userRole == '2') {
        DisableFileldsForManager();
    }
    $("#txtPassportNumber").focusout(function () {
        if ($("#txtPassportNumber").val().trim() == passportN) {

        }
        else {
            CheckNameExists();
        }
    });
    $("#btnUploadRemainingFiles").val("Upload Files/ Documents");
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
                    GetAllUploads("PASSPORT", empNo.replace('ARIS-', ''));  // testing is in progress
                    GetAllUploads("RESIDENT", empNo.replace('ARIS-', ''));
                    GetAllUploads("REMAINING", empNo.replace('ARIS-', ''));
                }
            }
        );
   
}
function uploadDocuments_remaining(inputId) {

    var docId = inputId.split("_")[1];
    var input = document.getElementById(inputId);

    var dpName = 'dp_' + docId;
    if ($("#" + dpName + "").val().trim() == 'No Expiry Required' || $("#" + dpName + "").val().trim() != '') {
        var files = input.files;
        var formData = new FormData();
        var empNo = $("#txtEmployeeNumber").val().trim();
        for (var i = 0; i != files.length; i++) {
            formData.append("files", files[i]);
        }
        formData.append("empNo", empNo);
        formData.append("docId", parseInt(docId));
        formData.append("expDate", $("#" + dpName + "").val().trim());
        $.ajax(
            {
                url: "/MasterPages/ManageEmployees/UploadDocumentsRemaining",
                data: formData,
                processData: false,
                contentType: false,
                type: "POST",
                async: false,
                success: function (data) {
                    GetAllUploads("PASSPORT", empNo.replace('ARIS-', ''));  // testing is in progress
                    GetAllUploads("RESIDENT", empNo.replace('ARIS-', ''));
                    GetAllUploads("REMAINING", empNo.replace('ARIS-', ''));
                }
            }
        );
    }
    else {
        $("#" + inputId + "").val(null);
        MessageBox('Required!', 'fa fa-times', 'Expiry date!', 'red', 'btn btn-danger', 'Okay');

    }
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
    var upldId = 0;
    var hasFile = false;
    table_passport = $("#tblPassportFiles").DataTable(
        {
            bLengthChange: false,
            bFilter: false,
            bSort: true,
            bPaginate: false,
            data: response,
            ScrollX: false,
            //response: true,
            //scrollY: true,
            //scrollX: true,
            //scrollY: "500px",
            //sScrollX: "100%",
            scrollCollapse: true,
            select: true,
            pageLength: 10,
            destroy: true,
            order:[[2,'asc']],
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
                    data: 'isMandatory', title: 'Mandatory', visible: true,
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
                    data: null,
                    title: 'Upload',
                    class: 'upload',
                    render: function (data) {
                        if (isUploadAllowed && !hasFile) {
                            return '<input type="file" id="upload_' + docId + '" onchange="uploadDocuments(\'upload_' + docId + '\');">';
                        }
                        else {
                            return '<input type="file" id="upload_' + docId + '" disabled onchange="uploadDocuments(\'upload_' + docId + '\');">';

                        }
                    }
                },
                {
                    data: null, title: 'Delete',
                    class: 'delete',
                    render: function (data) {
                        if (isUploadAllowed && hasFile == false) {
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
function populateResident(response) {
    var docId = 0;
    var upldId = 0;
    var hasFile = false;
    table_resident = $("#tblResidentFiles").DataTable(
        {
            bLengthChange: false,
            bFilter: false,
            bSort: true,
            bPaginate: false,
            data: response,
            ScrollX: false,
            //scrollY: true,
            //scrollX: true,
            //scrollY: "650px",
            //sScrollX: "100%",
            //scrollCollapse: true,
            select: true,
            pageLength: 10,
            destroy: true,
            order: [[2, 'asc']],
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
                            hasFile = false;

                            return data;
                        }
                        else {
                            hasFile = true;
                            return '<a href="#" id="download_' + docId + '">' + data + '</a>';                        }
                    }
                },
                {
                    data: 'isMandatory', title: 'Mandatory', visible: true,
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
                    data: null,
                    title: 'Upload',
                    class: 'upload',
                    render: function (data) {
                        if (isUploadAllowed && !hasFile) {
                            return '<input type="file" id="upload_' + docId + '" onchange="uploadDocuments(\'upload_' + docId + '\');">';
                        }
                        else {
                            return '<input type="file" id="upload_' + docId + '" disabled onchange="uploadDocuments(\'upload_' + docId + '\');">';
                        }
                    }
                },
                {
                    data: null, title: 'Delete',
                    class: 'delete',
                    render: function (data) {
                        if (isUploadAllowed && hasFile == false) {
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
function populateRemaining(response) {
    var docId = 0;
    var isExpReq = 0;
    var upldId = 0;
    var hasFile = false;
    table_remaining = $("#tblRemainingFiles").DataTable(
        {
            bLengthChange: false,
            bFilter: false,
            bSort: false,
            bPaginate: false,
            bInfo:false,
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
                        if (data != null) { docId = data; }
                        return data;
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
                    data: 'filePath', title: 'File Path', visible: false,
                },
               
                {
                    data: 'documentName', title: 'Document Name'
                },
                {
                    data: 'isMandatory', title: 'Mandatory', visible: true,
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
                    data: 'fileName', title: 'File Name',
                    class: 'download',
                    render: function (data) {
                        if (data == "No Files") {
                            hasFile = false;
                            return data;
                        }
                        else {
                            hasFile = true;
                            return '<a href="#"  id="download_' + docId + '">' + data + '</a>';
                        }
                    }
                },
                
                {
                    data: 'expiryDate', title: 'Expiry', visible: true, class:'text-center',
                    render: function (data) {
                        var eDate;
                        if (isExpReq == 1) {
                            if (data != null) {
                                 eDate = data;
                            }
                            return '<input type="date"  value="' + eDate + '"  class="form - control expiry" id="dp_' + docId + '" style="width: 132px; font - size: smaller; " >';
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
                        if (isUploadAllowed && !hasFile) {
                            return '<input type="file" id="upload_' + docId + '" onchange="uploadDocuments_remaining(\'upload_' + docId + '\');">';
                        }
                        else {
                            return '<input type="file" id="upload_' + docId + '" disabled onchange="uploadDocuments_remaining(\'upload_' + docId + '\');">';
                        }
                    }
                },
                {
                    data: null, title: 'Delete',
                    class: 'delete',
                    render: function (data) {
                        if (isUploadAllowed && hasFile == false) {
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
    //var passportExpiryDate = $("#dpPassportExpiryDate").val() != '' ? $("#dpPassportExpiryDate").datepicker('getDate').toLocaleString() : '';
    var passportExpiryDate = moment(new Date($("#dpPassportExpiryDate").val())).format('YYYY-MM-DD');
    console.log(moment(new Date(passportExpiryDate)).format('YYYY-MM-DD'));
    var residentNumber = $("#txtResidentNumber").val();
    //var residentExpiryDate = $("#dpResidentExpiryDate").val() != '' ? $("#dpResidentExpiryDate").datepicker('getDate').toLocaleString() : '';
    var residentExpiryDate = $("#dpResidentExpiryDate").val();
    //var joiningDate = $("#dpJoiningDate").val() != '' ? $("#dpJoiningDate").datepicker('getDate').toLocaleString() : '';
    var joiningDate = $("#dpJoiningDate").val();
   //var contractStartDate = $("#dpContractStartDate").val() != '' ? $("#dpContractStartDate").datepicker('getDate').toLocaleString() : '';
    var contractStartDate = $("#dpContractStartDate").val();
    //var contractEndDate = $("#dpContractEndDate").val() != '' ? $("#dpContractEndDate").datepicker('getDate').toLocaleString() : '';
    var contractEndDate = $("#dpContractEndDate").val();
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
        //showLoader(true);
        callAjax('POST', '/MasterPages/ManageEmployees/UpdateRequest', data);
        GetAllEmployees();
        ClearFields();
    }
    else {
    }
}
///code to remove unwanted files from table
function deleteInvalidUploads() {
    var userId = loggedInUserId; 
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
//download function for Resident Card files
$('#tblResidentFiles').on('click', 'td.download', function(e) {
    e.preventDefault();
    try {
        var filePath = table_resident.row(this).data()['filePath'];
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
//download function for Remining uploads
$('#tblRemainingFiles').on('click', 'td.download', function(e) {
    e.preventDefault();
    try {
        var filePath = table_remaining.row(this).data()['filePath'];
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
                    $(".btn-blue").attr('disabled', 'disabled');
                    $(".btn-default").attr('disabled', 'disabled');
                    SubmitRequest();
                }
            },
            cancel: function () {
            },
        }
    });
});
$('.example-p-1').on('click', function () {
    var content;
    if ($("#btnUpdate").text() == 'Re-Submit') {
        content = 'Are you sure to Re-Submit the application?';
    }
    else {
        content = 'Are you sure to modify the Existing application?';
    }
    $.confirm({
        title: 'Are you sure?',
        content: content,
        icon: 'fa fa-question-circle',
        animation: 'scale',
        closeAnimation: 'scale',
        opacity: 0.5,
        buttons: {
            'confirm': {
                text: 'Yes',
                btnClass: 'btn-blue',
                action: function () {
                    $(".btn-blue").attr('disabled', 'disabled');
                    $(".btn-default").attr('disabled', 'disabled');
                    UpdateRequest();
                }
            },
            cancel: function () {
            },
        }
    });
});
$('.example-p-3').on('click', function () {
    var isValid = false;
    isValid = isValidEntryApproveOrSendBack();
    if (isValid) {
        $.confirm({
            title: 'Are you sure?',
            content: 'Are you sure that you want to send back the details to Admin',
            icon: 'fa fa-question-circle',
            animation: 'scale',
            closeAnimation: 'scale',
            opacity: 0.5,
            buttons: {
                'confirm': {
                    text: 'Yes',
                    btnClass: 'btn-blue',
                    action: function () {
                        $(".btn-blue").attr('disabled', 'disabled');
                        $(".btn-default").attr('disabled', 'disabled');

                        //showLoader_employee(true);

                        SendBackRequest();
                    }
                },
                cancel: function () {
                },
            }
        });
        

    }
});
$('.example-p-4').on('click', function () {
    var isValid = false;
    isValid = isValidEntryApproveOrSendBack();
    if (isValid) {
        $.confirm({
            title: 'Are you sure?',
            content: 'Are you sure to save the records to the system',
            icon: 'fa fa-question-circle',
            animation: 'scale',
            closeAnimation: 'scale',
            opacity: 0.5,
            buttons: {
                'confirm': {
                    text: 'Yes',
                    btnClass: 'btn-blue',
                    action: function () {
                        $(".btn-blue").attr('disabled', 'disabled');
                        $(".btn-default").attr('disabled', 'disabled');
                        ApproveRequest();
                    }
                },
                cancel: function () {
                },
            }
        });
    }
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
                        //showAlert({ title: "Warning!", message: 'An employee is exists with same passport number!', type: "WARNING" });
                        MessageBox('Exists!', 'fa fa-user', 'An employee is exists with same passport number!', 'orange', 'btn btn-warning', 'Okay');

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

//from index
function getCompanies() {
    try {

        bindDropDownList('ddlCompany', 'GET', '/MasterPages/ManageEmployees/GetCompanies', 'json', 'companyId', 'companyName');

    }
    catch (err) {
        console.log(err);
    }
}
function isValidEntry() {
    var valid = true;
    var message = '';
    var count = 0;

    if ($('#txtEmployeeName').val() == '') {
        $('#txtEmployeeName').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Employee Name </br>';
    }
    else {
        $('#txtEmployeeName').css('border-color', '');
    }
    if ($("#ddlCompany").val() == 0) {
        $('#ddlCompany').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Client </br>';
    }
    else {
        $('#ddlCompany').css('border-color', '');
    }
    if ($("#ddlCountry").val() == 0) {
        $('#ddlCountry').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Country </br>';
    }
    else {
        $('#ddlCountry').css('border-color', '');
    }
    if ($("#txtPassportNumber").val() == '') {
        $('#txtPassportNumber').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Passport Number </br>';
    }
    else {
        $('#txtPassportNumber').css('border-color', '');
    }
    if ($("#dpPassportExpiryDate").val() == '') {
        $('#dpPassportExpiryDate').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Passport Expiry Date </br>';
    }
    else {
        $('#dpPassportExpiryDate').css('border-color', '');
    }
    if ($("#txtResidentNumber").val() == '') {
        $('#txtResidentNumber').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Resident Number </br>';
    }
    else {
        $('#txtResidentNumber').css('border-color', '');
    }
    if ($("#dpResidentExpiryDate").val() == '') {
        $('#dpResidentExpiryDate').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Resident Expiry date </br>';
    }
    else {
        $('#dpResidentExpiryDate').css('border-color', '');
    }
    if ($("#dpJoiningDate").val() == '') {
        $('#dpJoiningDate').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Joining Date </br>';
    }
    else {
        $('#dpJoiningDate').css('border-color', '');
    }
    if ($("#dpContractStartDate").val() == '') {
        $('#dpContractStartDate').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Contract Start Date </br>';
    }
    else {
        $('#dpContractStartDate').css('border-color', '');
    }
    if ($("#dpContractEndDate").val() == '') {
        $('#dpContractEndDate').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Contract End Date </br>';
    }
    else {
        $('#dpContractEndDate').css('border-color', '');
    }
    if ($("#txtGsm").val() == '') {
        $('#txtGsm').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. GSM </br>';
    }
    else {
        $('#txtGsm').css('border-color', '');
    }
    if ($("#txtAccomodationDetails").val() == '') {
        $('#txtAccomodationDetails').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Accomodation Details </br>';
    }
    else {
        $('#txtAccomodationDetails').css('border-color', '');

    }
    if ($("#txtIdProfession").val() == '') {
        $('#txtIdProfession').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. ID Profession </br>';
    }
    else {
        $('#txtIdProfession').css('border-color', '');
    }

    if ($("#txtDesignation").val() == '') {
        $('#txtDesignation').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Designation </br>';
    }
    else {
        $('#txtDesignation').css('border-color', '');
    }
    if ($("#txtBankName").val() == '') {
        $('#txtBankName').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Bank Name </br>';
    }
    else {
        $('#txtBankName').css('border-color', '');
    }

    if ($("#txtAccountNumber").val() == '') {
        $('#txtAccountNumber').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Account Number </br>';
    }
    else {
        $('#txtAccountNumber').css('border-color', '');
    }
    if ($("#txtConfirmAccountNumber").val() == '') {
        $('#txtConfirmAccountNumber').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Confirm Account Number </br>';
    }
    else {
        $('#txtConfirmAccountNumber').css('border-color', '');
    }
    if ($("#txtRemarks").val() == '') {
        $('#txtRemarks').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Remarks </br>';
    }
    else {
        $('#txtRemarks').css('border-color', '');
    }

    if (!CheckMandatoryUploads()) {
        valid = false;
        count = count + 1;
        message += count + '. Upload All Mandatory Documents  </br>';
    }

    if ($("#dpJoiningDate").val() != '' && $("#dpContractStartDate").val() != '' && $("#dpContractEndDate").val() != '') {
        var ceDate = new Date($("#dpContractEndDate").val());
        var csdate = new Date($("#dpContractStartDate").val());
        var jDate = new Date($("#dpJoiningDate").val());
        if ((ceDate < csdate) || (ceDate < jDate)) {
            valid = false;
            count = count + 1;
            message += count + '. Contract end date should not be older than joining date/ contract start date';
        }
    }

    if (message != '') {
        MessageBox('Required!', 'fa fa-warning', message, 'red', 'btn btn-danger', 'Okay');
        valid = false;
        message = '';
        count = 0;
    }
    else {
        valid = true;
    }
    return valid;
}
function ClearFields() {
    $("#txtEmployeeName").val('');
    $("#ddlCompany").val(0);
    $("#ddlCountry").val(0);

    $('#txtPassportNumber').val('');
    $('#dpPassportExpiryDate').val('');

    $('#txtResidentNumber').val('');

    $('#dpResidentExpiryDate').val('');

    $('#dpJoiningDate').val('');

    $('#dpContractStartDate').val('');

    $('#dpContractEndDate').val('');

    $('#txtGsm').val('');
    $('#txtAccomodationDetails').val('');
    $("input[name='radioMarital']").prop('checked', false).attr('disabled', false);


    $('#txtIdProfession').val('');

    $('#txtDesignation').val('');

    $('#txtBankName').val('');

    $('#txtAccountNumber').val('');
    $('#txtConfirmAccountNumber').val('');

    $("#hdnEmployeePicturePath").val('');
    $("#imgUser").attr('src', "/img/avatar.png");
    $("#files").val(null);
    $("#txtRemarks").val('');
    $("#btnUpdate").hide();
    $("#btnSubmit").show();
    GetEmployeeReferenceNo();
    clearValidationCSS();
    passportN = '';

    if (userRole == '2') {
        $("#btnUpdate").hide();
        $("#btnSubmit").hide();
        $("#btnSendBack").hide();
        $("#btnApprove").hide();
        $("#btnReset").hide();
        $("#txtEmployeeNumber").val('');
    }
    else {

    }
}
function GetAllEmployees() {
    showLoader(true);
    $.ajax({
        type: "GET",
        url: "/MasterPages/ManageEmployees/GetAllEmployees",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null) {
                populateEmployees(response);
            } else {
                console.log("Something went wrong");
            }
            // showLoader(false);
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
function populateEmployees(response) {
    var clr;
    table = $('#tblEmployees').DataTable(
        {
            bLengthChange: false,
            bFilter: true,
            bSort: true,
            bPaginate: true,
            data: response,
            scrollX: true,
            //sScrollXInner: "100%",
            ////scrollY: false,
            //scrollY: "650px",
            ////sScrollX: "100%",
            //scrollCollapse: true,
            ScrollX: false,

            select: true,
            pageLength: 10,
            destroy: true,
            order: [[2, "asc"]],

            columnDefs: [
                {
                    render: function (data, type, full, meta) {
                        return "<div class='text-wrap width-35'>" + data + "</div>";
                    },
                    targets: 2
                }
            ],
            columns: [
                {
                    data: null,
                    title: 'View',
                    class: 'edit',
                    defaultContent: '<button type="button" class="btn btn-sm btn-success"><i class="fas fa-edit"></i></button>',
                    orderable: false
                },
                {
                    data: 'employeeNo', title: 'Employee Number', visible: false,
                },
                {
                    data: 'employeeReferenceNo', title: 'Employee</br> No',
                    render: function (data) {
                        return 'ARIS-' + data;
                    }
                },
                {
                    data: 'employeeName', title: 'Employee</br> Name'
                },
                {
                    data: 'approvalStatus', title: 'Status',
                    render: function (data) {
                        if (data == 2) {
                            clr = 'success';
                            return '<span style="color:green;font-size:95%;font-weight:bold">Approved</span>';
                        }
                        else if (data == 1) {
                            clr = 'danger';
                            return '<span style="color:red;font-size:95%;font-weight:bold;">Sent Back</span>';
                        }
                        else if (data == 0) {
                            clr = 'warning';
                            return '<span style="color:orange;font-size:95%;font-weight:bold;">Pending</span>';
                        }
                    }

                },
                
            ]
        });

}
function GetEmployeeReferenceNo() {
    showLoader(true);

    if (userRole!='2')
    $.ajax({
        type: "GET",
        url: "/MasterPages/ManageEmployees/GetEmployeeReferenceNo",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {

            if (response.success == true) {
                $("#txtEmployeeNumber").val('ARIS-' + response.responseText);
                deleteInvalidUploads();

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
$('#tblEmployees').on('click', 'td.edit', function (e) {
    e.preventDefault();

    clearValidationCSS();
    DisableExpiry();
    approvalStatusId = parseInt(table.row(this).data()['approvalStatus']);
    if (approvalStatusId == 0 && userRole == '1') {
        empNO = parseInt(table.row(this).data()['employeeNo']);
        $("#txtEmployeeNumber").val('ARIS-' + table.row(this).data()['employeeReferenceNo']);
        $("#txtEmployeeName").val(table.row(this).data()['employeeName']).attr('disabled', 'disabled');
        $("#ddlCompany").val(table.row(this).data()['companyId']).attr('disabled', 'disabled');
        $("#ddlCountry").val(table.row(this).data()['nationality']).attr('disabled', 'disabled');
        $("#txtPassportNumber").val(table.row(this).data()['passportNumber']).attr('disabled', 'disabled');
        passportN = table.row(this).data()['passportNumber'].trim();
        //$("#dpPassportExpiryDate").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['passportExpiryDate'].replace('T00:00:00', ''))).attr('disabled', 'disabled');
        $("#dpPassportExpiryDate").val(moment(table.row(this).data()['passportExpiryDate']).format('DD/MM/YYYY').replace('T00:00:00', '')).attr('disabled', 'disabled');

        $("#txtResidentNumber").val(table.row(this).data()['residentNumber']).attr('disabled', 'disabled');
        //$("#dpResidentExpiryDate").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['residentExpiryDate'].replace('T00:00:00', ''))).attr('disabled', 'disabled');
        $("#dpResidentExpiryDate").val(moment(table.row(this).data()['residentExpiryDate']).format('DD/MM/YYYY').replace('T00:00:00', '')).attr('disabled', 'disabled');

        //$("#dpJoiningDate").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['joiningDate'].replace('T00:00:00', ''))).attr('disabled', 'disabled');
        $("#dpJoiningDate").val(moment(table.row(this).data()['joiningDate']).format('DD/MM/YYYY').replace('T00:00:00', '')).attr('disabled', 'disabled');
        $("#dpContractStartDate").val(moment(table.row(this).data()['contractStartDate']).format('DD/MM/YYYY').replace('T00:00:00', '')).attr('disabled', 'disabled');

//        $("#dpContractEndDate").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['contractEndDate'].replace('T00:00:00', ''))).attr('disabled', 'disabled');
        $("#dpContractEndDate").val(moment(table.row(this).data()['contractEndDate']).format('DD/MM/YYYY').replace('T00:00:00', '')).attr('disabled', 'disabled');

        $("#txtGsm").val(parseInt(table.row(this).data()['gsm'])).attr('disabled', 'disabled');
        $("#txtAccomodationDetails").val(table.row(this).data()['accomodationDetails']).attr('disabled', 'disabled');
        $("input[name='radioMarital'][value='" + table.row(this).data()['maritalStatus'] + "']").prop('checked', true).attr('disabled', 'disabled');
        $("#txtIdProfession").val(table.row(this).data()['idProfession']).attr('disabled', 'disabled');
        $("#txtDesignation").val(table.row(this).data()['designation']).attr('disabled', 'disabled');
        $("#txtBankName").val(table.row(this).data()['bankName']).attr('disabled', 'disabled');
        $("#txtAccountNumber").val(table.row(this).data()['bankAccountNumber']).attr('disabled', 'disabled');
        $("#txtConfirmAccountNumber").val(table.row(this).data()['bankAccountNumber']).attr('disabled', 'disabled');
        $("#div_confirmAccNo").show();
        $("#txtRemarks").val(table.row(this).data()['remarks']).attr('disabled', 'disabled');
        //$("#imgUser").attr('src', "/Uploads/employeeUploads/" + $("#txtEmployeeNumber").val() + "/" + table.row(this).data()['employeeImage']).attr('disabled', 'disabled');
        if (table.row(this).data()['employeeImage'] != null) {
            $("#imgUser").attr('src', "/Uploads/employeeUploads/" + $("#txtEmployeeNumber").val() + "/" + table.row(this).data()['employeeImage']).attr('disabled', 'disabled');
        }
        else {
            $("#imgUser").attr('src', "/img/avatar.png").attr('disabled', 'disabled');
        }
        isUploadAllowed = false; // new for restrict uploads
        GetAllUploads("PASSPORT", table.row(this).data()['employeeReferenceNo']);  // testing is in progress
        GetAllUploads("RESIDENT", table.row(this).data()['employeeReferenceNo']);
        GetAllUploads("REMAINING", table.row(this).data()['employeeReferenceNo']);
        $("#btnUpdate").hide();
        $("#btnSubmit").hide();
        disableRadioButtonGroup(true);
        $("#files").attr("disabled", "disabled");
        $(".expiry").attr("disabled", "disabled");

    }
    else if ((approvalStatusId == 1 || approvalStatusId == 2) && userRole == '1') {

        empNO = parseInt(table.row(this).data()['employeeNo']);
        $("#txtEmployeeNumber").val('ARIS-' + table.row(this).data()['employeeReferenceNo']);
        $("#txtEmployeeName").val(table.row(this).data()['employeeName']).attr('disabled', false);
        $("#ddlCompany").val(table.row(this).data()['companyId']).attr('disabled', false);
        $("#ddlCountry").val(table.row(this).data()['nationality']).attr('disabled', false);
        $("#txtPassportNumber").val(table.row(this).data()['passportNumber']).attr('disabled', false);
        passportN = table.row(this).data()['passportNumber'].trim();
        //$("#dpPassportExpiryDate").datepicker("setDate", $.datepicker.parseDate("yyyy-mm-dd", table.row(this).data()['passportExpiryDate'].replace('T00:00:00', ''))).attr('disabled', false);
        $("#dpPassportExpiryDate").val(moment(table.row(this).data()['passportExpiryDate']).format('DD/MM/YYYY').replace('T00:00:00', '')).attr('disabled', false);
        $("#txtResidentNumber").val(table.row(this).data()['residentNumber']).attr('disabled', false);

       // $("#dpResidentExpiryDate").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['residentExpiryDate'].replace('T00:00:00', ''))).attr('disabled', false);
        $("#dpResidentExpiryDate").val(moment(table.row(this).data()['residentExpiryDate']).format('DD/MM/YYYY').replace('T00:00:00', '')).attr('disabled', false);

        //$("#dpJoiningDate").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['joiningDate'].replace('T00:00:00', ''))).attr('disabled', false);
        $("#dpJoiningDate").val(moment(table.row(this).data()['joiningDate']).format('DD/MM/YYYY').replace('T00:00:00', '')).attr('disabled', false);

        //$("#dpContractStartDate").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['contractStartDate'].replace('T00:00:00', ''))).attr('disabled', false);
        $("#dpContractStartDate").val(moment(table.row(this).data()['contractStartDate']).format('DD/MM/YYYY').replace('T00:00:00', '')).attr('disabled', false);

       // $("#dpContractEndDate").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['contractEndDate'].replace('T00:00:00', ''))).attr('disabled', false);
        $("#dpContractEndDate").val(moment(table.row(this).data()['contractEndDate']).format('DD/MM/YYYY').replace('T00:00:00', '')).attr('disabled', false);

        $("#txtGsm").val(parseInt(table.row(this).data()['gsm'])).attr('disabled', false);
        $("#txtAccomodationDetails").val(table.row(this).data()['accomodationDetails']).attr('disabled', false);
        $("input[name='radioMarital'][value='" + table.row(this).data()['maritalStatus'] + "']").prop('checked', true).attr('disabled', false);
        $("#txtIdProfession").val(table.row(this).data()['idProfession']).attr('disabled', false);
        $("#txtDesignation").val(table.row(this).data()['designation']).attr('disabled', false);
        $("#txtBankName").val(table.row(this).data()['bankName']).attr('disabled', false);
        $("#txtAccountNumber").val(table.row(this).data()['bankAccountNumber']).attr('disabled', false);
        $("#txtConfirmAccountNumber").val(table.row(this).data()['bankAccountNumber']).attr('disabled', false);
        $("#div_confirmAccNo").show();
       // $("#txtRemarks").val(table.row(this).data()['remarks']).attr('disabled', false);
        $("#txtRemarks").val('').attr('disabled', false);
       // $("#imgUser").attr('src', "/Uploads/employeeUploads/" + $("#txtEmployeeNumber").val() + "/" + table.row(this).data()['employeeImage']).attr('disabled', false);
        if (table.row(this).data()['employeeImage'] != null) {
            $("#imgUser").attr('src', "/Uploads/employeeUploads/" + $("#txtEmployeeNumber").val() + "/" + table.row(this).data()['employeeImage']).attr('disabled', 'disabled');
        }
        else {
            $("#imgUser").attr('src', "/img/avatar.png").attr('disabled', 'disabled');
        }
        isUploadAllowed = true;// new for restrict uploads
        GetAllUploads("PASSPORT", table.row(this).data()['employeeReferenceNo']);  // testing is in progress
        GetAllUploads("RESIDENT", table.row(this).data()['employeeReferenceNo']);
        GetAllUploads("REMAINING", table.row(this).data()['employeeReferenceNo']);
        if (userRole == '1' && approvalStatusId == 1) {
            $("#btnUpdate").text('Re-Submit').show();

        }
        else if (userRole == '1' && approvalStatusId == 2) {
            $("#btnUpdate").text('Modify').show();
        }
        $("#btnSubmit").hide();
        disableRadioButtonGroup(false);
        $("#files").attr("disabled", false);
        $(".expiry").attr('disabled', false);



    }
    else if (approvalStatusId == 0 && userRole == '2') {

        empNO = parseInt(table.row(this).data()['employeeNo']);
        $("#txtEmployeeNumber").val('ARIS-' + table.row(this).data()['employeeReferenceNo']);
        $("#txtEmployeeName").val(table.row(this).data()['employeeName']).attr('disabled', 'disabled');
        $("#ddlCompany").val(table.row(this).data()['companyId']).attr('disabled', 'disabled');
        $("#ddlCountry").val(table.row(this).data()['nationality']).attr('disabled', 'disabled');
        $("#txtPassportNumber").val(table.row(this).data()['passportNumber']).attr('disabled', 'disabled');
        //$("#dpPassportExpiryDate").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['passportExpiryDate'].replace('T00:00:00', ''))).attr('disabled', 'disabled');
        $("#dpPassportExpiryDate").val(moment(table.row(this).data()['passportExpiryDate']).format('DD/MM/YYYY').replace('T00:00:00', '')).attr('disabled', 'disabled');
        $("#txtResidentNumber").val(table.row(this).data()['residentNumber']).attr('disabled', 'disabled');
        //$("#dpResidentExpiryDate").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['residentExpiryDate'].replace('T00:00:00', ''))).attr('disabled', 'disabled');
        $("#dpResidentExpiryDate").val(moment(table.row(this).data()['residentExpiryDate']).format('DD/MM/YYYY').replace('T00:00:00', '')).attr('disabled', 'disabled');

        //$("#dpJoiningDate").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['joiningDate'].replace('T00:00:00', ''))).attr('disabled', 'disabled');
        $("#dpJoiningDate").val(moment(table.row(this).data()['joiningDate']).format('DD/MM/YYYY').replace('T00:00:00', '')).attr('disabled', 'disabled');

        //$("#dpContractStartDate").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['contractStartDate'].replace('T00:00:00', ''))).attr('disabled', 'disabled');
        $("#dpContractStartDate").val(moment(table.row(this).data()['contractStartDate']).format('DD/MM/YYYY').replace('T00:00:00', '')).attr('disabled', 'disabled');

        //$("#dpContractEndDate").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['contractEndDate'].replace('T00:00:00', ''))).attr('disabled', 'disabled');
        $("#dpContractEndDate").val(moment(table.row(this).data()['contractEndDate']).format('DD/MM/YYYY').replace('T00:00:00', '')).attr('disabled', 'disabled');

        $("#txtGsm").val(parseInt(table.row(this).data()['gsm'])).attr('disabled', 'disabled');
        $("#txtAccomodationDetails").val(table.row(this).data()['accomodationDetails']).attr('disabled', 'disabled');
        $("input[name='radioMarital'][value='" + table.row(this).data()['maritalStatus'] + "']").prop('checked', true).attr('disabled', 'disabled');
        $("#txtIdProfession").val(table.row(this).data()['idProfession']).attr('disabled', 'disabled');
        $("#txtDesignation").val(table.row(this).data()['designation']).attr('disabled', 'disabled');
        $("#txtBankName").val(table.row(this).data()['bankName']).attr('disabled', 'disabled');
        $("#txtAccountNumber").val(table.row(this).data()['bankAccountNumber']).attr('disabled', 'disabled');
        $("#txtConfirmAccountNumber").val(table.row(this).data()['bankAccountNumber']).attr('disabled', 'disabled').hide();
        $("#div_confirmAccNo").hide();
       // $("#txtRemarks").val(table.row(this).data()['remarks']).attr('enabled', true);
        $("#txtRemarks").val('').attr('enabled', true);
        if (table.row(this).data()['employeeImage']!= null)
            {
                $("#imgUser").attr('src', "/Uploads/employeeUploads/" + $("#txtEmployeeNumber").val() + "/" + table.row(this).data()['employeeImage']).attr('disabled', 'disabled');
            }
        else 
            {
                $("#imgUser").attr('src', "/img/avatar.png").attr('disabled', 'disabled');
            }
        isUploadAllowed = false; // new for restrict uploads
        GetAllUploads("PASSPORT", table.row(this).data()['employeeReferenceNo']);  // testing is in progress
        GetAllUploads("RESIDENT", table.row(this).data()['employeeReferenceNo']);
        GetAllUploads("REMAINING", table.row(this).data()['employeeReferenceNo']);
        $("#btnUpdate").hide();
        $("#btnSubmit").hide();
        disableRadioButtonGroup(true);
        $("#files").attr("disabled", "disabled");
        $(".expiry").attr('disabled', 'disabled');

        $("#btnSendBack").show();
        $("#btnApprove").show();
        $("#btnUploadRemainingFiles").val("Uploaded Files/ Documents");

        $("#div_confidential").show();
        GetConfidentialUploads();
    }
    else if ((approvalStatusId == 1 || approvalStatusId==2) && userRole == '2') {
        empNO = parseInt(table.row(this).data()['employeeNo']);
        $("#txtEmployeeNumber").val('ARIS-' + table.row(this).data()['employeeReferenceNo']);
        $("#txtEmployeeName").val(table.row(this).data()['employeeName']).attr('disabled', 'disabled');
        $("#ddlCompany").val(table.row(this).data()['companyId']).attr('disabled', 'disabled');
        $("#ddlCountry").val(table.row(this).data()['nationality']).attr('disabled', 'disabled');
        $("#txtPassportNumber").val(table.row(this).data()['passportNumber']).attr('disabled', 'disabled');
        //$("#dpPassportExpiryDate").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['passportExpiryDate'].replace('T00:00:00', ''))).attr('disabled', 'disabled');
        $("#dpPassportExpiryDate").val(moment(table.row(this).data()['passportExpiryDate']).format('DD/MM/YYYY').replace('T00:00:00', '')).attr('disabled', 'disabled');

        $("#txtResidentNumber").val(table.row(this).data()['residentNumber']).attr('disabled', 'disabled');
        //$("#dpResidentExpiryDate").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['residentExpiryDate'].replace('T00:00:00', ''))).attr('disabled', 'disabled');
        $("#dpResidentExpiryDate").val(moment(table.row(this).data()['residentExpiryDate']).format('DD/MM/YYYY').replace('T00:00:00', '')).attr('disabled', 'disabled');

        //$("#dpJoiningDate").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['joiningDate'].replace('T00:00:00', ''))).attr('disabled', 'disabled');
        $("#dpJoiningDate").val(moment(table.row(this).data()['joiningDate']).format('DD/MM/YYYY').replace('T00:00:00', '')).attr('disabled', 'disabled');

        //$("#dpContractStartDate").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['contractStartDate'].replace('T00:00:00', ''))).attr('disabled', 'disabled');
        $("#dpContractStartDate").val(moment(table.row(this).data()['contractStartDate']).format('DD/MM/YYYY').replace('T00:00:00', '')).attr('disabled', 'disabled');

        //$("#dpContractEndDate").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['contractEndDate'].replace('T00:00:00', ''))).attr('disabled', 'disabled');
        $("#dpContractEndDate").val(moment(table.row(this).data()['contractEndDate']).format('DD/MM/YYYY').replace('T00:00:00', '')).attr('disabled', 'disabled');

        $("#txtGsm").val(parseInt(table.row(this).data()['gsm'])).attr('disabled', 'disabled');
        $("#txtAccomodationDetails").val(table.row(this).data()['accomodationDetails']).attr('disabled', 'disabled');
        $("input[name='radioMarital'][value='" + table.row(this).data()['maritalStatus'] + "']").prop('checked', true).attr('disabled', 'disabled');
        $("#txtIdProfession").val(table.row(this).data()['idProfession']).attr('disabled', 'disabled');
        $("#txtDesignation").val(table.row(this).data()['designation']).attr('disabled', 'disabled');
        $("#txtBankName").val(table.row(this).data()['bankName']).attr('disabled', 'disabled');
        $("#txtAccountNumber").val(table.row(this).data()['bankAccountNumber']).attr('disabled', 'disabled');
        $("#txtConfirmAccountNumber").val(table.row(this).data()['bankAccountNumber']).attr('disabled', 'disabled');
        $("#div_confirmAccNo").hide();
         $("#txtRemarks").val(table.row(this).data()['remarks']).attr('disabled', 'disabled');
        //$("#txtRemarks").val('').attr('enabled', true);
        //$("#imgUser").attr('src', "/Uploads/employeeUploads/" + $("#txtEmployeeNumber").val() + "/" + table.row(this).data()['employeeImage']).attr('disabled', 'disabled');
        if (table.row(this).data()['employeeImage'] != null) {
            $("#imgUser").attr('src', "/Uploads/employeeUploads/" + $("#txtEmployeeNumber").val() + "/" + table.row(this).data()['employeeImage']).attr('disabled', 'disabled');
        }
        else {
            $("#imgUser").attr('src', "/img/avatar.png").attr('disabled', 'disabled');
        }
        isUploadAllowed = false; // new for restrict uploads
        GetAllUploads("PASSPORT", table.row(this).data()['employeeReferenceNo']);  // testing is in progress
        GetAllUploads("RESIDENT", table.row(this).data()['employeeReferenceNo']);
        GetAllUploads("REMAINING", table.row(this).data()['employeeReferenceNo']);
        $("#btnUpdate").hide();
        $("#btnSubmit").hide();
        disableRadioButtonGroup(true);
        $("#files").attr("disabled", "disabled");
        $(".expiry").attr('disabled', 'disabled');

        $("#btnSendBack").hide();
        $("#btnApprove").hide();
        $("#div_confidential").show();
        GetConfidentialUploads();

    }
    $(window).scrollTop(0);
});
function DisableFileldsForManager() {
    $("#txtEmployeeNumber").val('');
    $("#txtEmployeeName").attr('disabled', 'disabled');
    $("#ddlCompany").attr('disabled', 'disabled');
    $("#ddlCountry").attr('disabled', 'disabled');
    $("#txtPassportNumber").attr('disabled', 'disabled');
    $("#dpPassportExpiryDate").attr('disabled', 'disabled');
    $("#txtResidentNumber").attr('disabled', 'disabled');
    $("#dpResidentExpiryDate").attr('disabled', 'disabled');
    $("#dpJoiningDate").attr('disabled', 'disabled');
    $("#dpContractStartDate").attr('disabled', 'disabled');
    $("#dpContractEndDate").attr('disabled', 'disabled');
    $("#txtGsm").attr('disabled', 'disabled');
    $("#txtAccomodationDetails").attr('disabled', 'disabled');
    $("input[name='radioMarital'][value='1']").attr('disabled', 'disabled');
    $("#txtIdProfession").attr('disabled', 'disabled');
    $("#txtDesignation").attr('disabled', 'disabled');
    $("#txtBankName").attr('disabled', 'disabled');
    $("#txtAccountNumber").attr('disabled', 'disabled');
    $("#txtConfirmAccountNumber").attr('disabled', 'disabled');
    $("#txtRemarks").attr('disabled', 'disabled');
    $("#imgUser").attr('disabled', 'disabled');
    isUploadAllowed = false; 
    $("#btnUpdate").hide();
    $("#btnSubmit").hide();
    $("#btnReset").hide();
    disableRadioButtonGroup(true);
    $("#files").attr("disabled", "disabled");
    $(".expiry").attr('disabled', 'disabled');

}
function ApproveRequest() {
    var remarks = $("#txtRemarks").val();
    var data = {
        EmployeeNo: empNO,
        Remarks: remarks
    };
        showLoader(true);
        callAjax('POST', '/MasterPages/ManageEmployees/ApproveRequest', data);
        GetAllEmployees();
    ClearFields();

   
}
function SendBackRequest() {
    var remarks = $("#txtRemarks").val();
    var data = {
        EmployeeNo: empNO,
        Remarks: remarks
    };
    callAjax('POST', '/MasterPages/ManageEmployees/SendBackRequest', data);
    

        GetAllEmployees();
        ClearFields();
   
}
function isValidEntryApproveOrSendBack() {

    var valid = true;
    var message = '';
    var count = 0;

    if ($("#txtRemarks").val().trim() == '') {
        $("#txtRemarks").css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Remarks </br>';

    }
    else {
        $("#txtRemarks").css('border-color', '');

    }
    if (!CheckMandatoryUploadsConfidential()) {
        valid = false;
        count = count + 1;
        message += count + '. Upload All Mandatory In Confidential Documents  </br>';
    }
    if (message != '') {
        MessageBox('Required!', 'fa fa-warning', message, 'red', 'btn btn-danger', 'Okay');
        valid = false;
        message = '';
        count = 0;
    }
    else {
        valid = true;
    }
    return valid;
}

function CheckMandatoryUploads() {
    try {
        var value = false;
        table_remaining.rows().every(function () {
            var Row = this.data();//store every row data in a variable
            if (Row['isMandatory'] == 1 && Row['fileName'] == 'No Files') {
                value = true;
                //return false
            }
        });

        table_passport.rows().every(function () {
            var Row = this.data();//store every row data in a variable
            if (Row['isMandatory'] == 1 && Row['fileName'] == 'No Files') {
                value = true;
            }
        });

        table_resident.rows().every(function () {
            var Row = this.data();//store every row data in a variable
            if (Row['isMandatory'] == 1 && Row['fileName'] == 'No Files') {
                value = true;
            }
        });

        if (value) {
            return false;
        }
        else {
            return true;
        }

    }
    catch (err) {
        console.log(err);
    }
}
function CheckMandatoryUploadsConfidential() {
    try {
        var value = false;
        tbl_docUpload.rows().every(function () {
            var Row = this.data();//store every row data in a variable
            if (Row['isMandatory'] == 1 && Row['fileName'] == 'No Files') {
                value = true;
                //return false
            }
        });

        if (value) {
            return false;
        }
        else {
            return true;
        }

    }
    catch (err) {
        console.log(err);
    }
}

function DisableExpiry() {
    $(".expiry").attr('disabled', true);
}

//Keyup validations
$("#txtEmployeeName").keyup(function () {
    if ($("#txtEmployeeName").val().trim() != '') {
        $('#txtEmployeeName').css('border-color', '');

    }
});
$("#ddlCompany").change(function () {
    if ($("#ddlCompany option:selected").val() != 0) {
        $('#ddlCompany').css('border-color', '');

    }
});
$("#ddlCountry").change(function () {
    if ($("#ddlCountry option:selected").val() != 0) {
        $('#ddlCountry').css('border-color', '');

    }
});
$("#txtPassportNumber").keyup(function () {
    if ($("#txtPassportNumber").val().trim() != '') {
        $('#txtPassportNumber').css('border-color', '');

    }
});
$("#dpPassportExpiryDate").change(function () {
    if ($("#dpPassportExpiryDate").val().trim() != '') {
        $('#dpPassportExpiryDate').css('border-color', '');

    }
});
$("#txtResidentNumber").keyup(function () {
    if ($("#txtResidentNumber").val().trim() != '') {
        $('#txtResidentNumber').css('border-color', '');

    }
});
$("#dpResidentExpiryDate").change(function () {
    if ($("#dpResidentExpiryDate").val().trim() != '') {
        $('#dpResidentExpiryDate').css('border-color', '');

    }
});
$("#dpJoiningDate").change(function () {
    if ($("#dpJoiningDate").val().trim() != '') {
        $('#dpJoiningDate').css('border-color', '');

    }
});
$("#dpContractStartDate").change(function () {
    if ($("#dpContractStartDate").val().trim() != '') {
        $('#dpContractStartDate').css('border-color', '');

    }
});
$("#dpContractEndDate").change(function () {
    if ($("#dpContractEndDate").val().trim() != '') {
        $('#dpContractEndDate').css('border-color', '');

    }
});
$("#txtGsm").keyup(function () {
    if ($("#txtGsm").val().trim() != '') {
        $('#txtGsm').css('border-color', '');

    }
});
$("#txtAccomodationDetails").keyup(function () {
    if ($("#txtAccomodationDetails").val().trim() != '') {
        $('#txtAccomodationDetails').css('border-color', '');

    }
});
$("#txtIdProfession").keyup(function () {
    if ($("#txtIdProfession").val().trim() != '') {
        $('#txtIdProfession').css('border-color', '');

    }
});
$("#txtDesignation").keyup(function () {
    if ($("#txtDesignation").val().trim() != '') {
        $('#txtDesignation').css('border-color', '');

    }
});
$("#txtBankName").keyup(function () {
    if ($("#txtBankName").val().trim() != '') {
        $('#txtBankName').css('border-color', '');

    }
});
$("#txtAccountNumber").keyup(function () {
    if ($("#txtAccountNumber").val().trim() != '') {
        $('#txtAccountNumber').css('border-color', '');

    }
});
$("#txtConfirmAccountNumber").keyup(function () {
    if ($("#txtConfirmAccountNumber").val().trim() != '') {
        $('#txtConfirmAccountNumber').css('border-color', '');

    }
});
$("#txtRemarks").keyup(function () {
    if ($("#txtRemarks").val().trim() != '') {
        $('#txtRemarks').css('border-color', '');

    }
});

function showLoader_employee(val) {
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
function DeleteSelectedFiles(inputId) {
    if (userRole == 1) {
        var uploadedId = inputId.split('_')[1];
        $.confirm({
            title: 'Are you sure?',
            content: 'Want to delete  the file ?',
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

}
function DeleteSelectedUploads(id) {
    var uploadFileId = id;
    var empId = $("#txtEmployeeNumber").val().trim();
    $.ajax({
        type: "GET",
        url: "/MasterPages/ManageEmployees/DeleteSelectedFiles",
        contentType: "application/json; charset=utf-8",
        data: { docUploadId: uploadFileId, empId: empId },
        dataType: "json",
        async: false,
        success: function (response) {
            if (response != null) {
                MessageBox('Deleted !', 'fa fa-times', 'Selected file has been deleted!', 'green', 'btn btn-success', 'Okay');

            } else {
            }
        },
        failure: function (response) {
            MessageBox('Error!', 'fa fa-times', 'Something went wrong', 'red', 'btn btn-danger', 'Okay');

        },
        error: function (response) {
            console.log(response.responseText);
        }
    });
    GetAllUploads("PASSPORT", $("#txtEmployeeNumber").val().replace('ARIS-', ''));
    GetAllUploads("RESIDENT", $("#txtEmployeeNumber").val().replace('ARIS-', ''));
    GetAllUploads("REMAINING", $("#txtEmployeeNumber").val().replace('ARIS-', ''));
}


function GetConfidentialUploads() {
    $.ajax({
        type: "GET",
        url: "/MasterPages/ManageEmployees/GetAllConfidentialUploads",
        contentType: "application/json; charset=utf-8",
        data: { empId: $("#txtEmployeeNumber").val().trim() },
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
    var isExpReq = 0;
    var upldId = 0;
    var hasFile = false;
    tbl_docUpload = $("#tblConfidentialFiles").DataTable(
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
                        if (data != null) { docId = data; }
                        return data;
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
                    data: 'filePath', title: 'File Path', visible: false,
                },

                {
                    data: 'documentName', title: 'Document Name'
                },
                {
                    data: 'isMandatory', title: 'Mandatory', visible: true,
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
                    data: 'fileName', title: 'File Name',
                    class: 'download',
                    render: function (data) {
                        if (data == "No Files") {
                            hasFile = false;
                            return data;
                        }
                        else {
                            hasFile = true;
                            return '<a href="#"  id="download_' + docId + '">' + data + '</a>';
                        }
                    }
                },

                {
                    data: 'expiryDate', title: 'Expiry', visible: true, class: 'text-center',
                    render: function (data) {
                        var eDate;
                        if (isExpReq == 1) {
                            if (data != null) {
                                eDate = data;
                            }
                            return '<input type="date"  value="' + eDate + '"  class="form - control expiry" id="dp_' + docId + '" style="width: 132px; font - size: smaller; " >';
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
                            return '<input type="file" id="upload_' + docId + '" onchange="uploadDocuments_confidential(\'upload_' + docId + '\');">';
                        }
                        else {
                            return '<input type="file" id="upload_' + docId + '" disabled onchange="uploadDocuments_confidential(\'upload_' + docId + '\');">';
                        }
                    }
                },
                {
                    data: null, title: 'Delete',
                    class: 'delete',
                    render: function (data) {
                        if (hasFile == false) {
                            return '<a href="#" hidden onclick="DeleteSelectedFilesConf(\'delete_' + upldId + '\');" id="delete_' + upldId + '"> Delete </a>';
                        }
                        else {
                            return '<a href="#" onclick="DeleteSelectedFilesConf(\'delete_' + upldId + '\');" id="delete_' + upldId + '"> Delete </a>';
                        }
                    }
                },

            ]
        });
}
$('#tblConfidentialFiles').on('click', 'td.download', function (e) {
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
function ToastPopups(type, title) {
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
function DeleteSelectedFilesConf(inputId) {
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
                    DeleteSelectedUploadsConf(uploadedId);
                }
            },
            cancel: function () {
            },
        }
    });

}
function DeleteSelectedUploadsConf(id) {
    var uploadFileId = id;
    $.ajax({
        type: "GET",
        url: "/MasterPages/ManageEmployees/DeleteSelectedFiles",
        contentType: "application/json; charset=utf-8",
        data: { docUploadId: uploadFileId },
        dataType: "json",
        async: false,
        success: function (response) {
            if (response != null) {
                MessageBox('Deleted !', 'fa fa-times', 'Selected file has been deleted!', 'green', 'btn btn-success', 'Okay');

            } else {
            }
        },
        failure: function (response) {
            MessageBox('Error!', 'fa fa-times', 'Something went wrong', 'red', 'btn btn-danger', 'Okay');

        },
        error: function (response) {
            console.log(response.responseText);
        }
    });
    GetConfidentialUploads();
}
function uploadDocuments_confidential(inputId) {

    var docId = inputId.split("_")[1];
    var input = document.getElementById(inputId);

    var dpName = 'dp_' + docId;
    if ($("#" + dpName + "").val().trim() == 'No Expiry Required' || $("#" + dpName + "").val().trim() != '') {
        var files = input.files;
        var formData = new FormData();
        var empNo = $("#txtEmployeeNumber").val().trim();
        for (var i = 0; i != files.length; i++) {
            formData.append("files", files[i]);
        }
        formData.append("empNo", empNo);
        formData.append("docId", parseInt(docId));
        formData.append("expDate", $("#" + dpName + "").val().trim());
        $.ajax(
            {
                url: "/MasterPages/ManageEmployees/UploadDocumentsRemaining",
                data: formData,
                processData: false,
                contentType: false,
                type: "POST",
                async: false,
                success: function (data) {
                    ToastPopups('SUCCESS', 'Selected document has been uploaded!');
                    GetConfidentialUploads();
                }
            }
        );
    }
    else {
        $("#" + inputId + "").val(null);
        MessageBox('Required!', 'fa fa-times', 'Expiry date!', 'red', 'btn btn-danger', 'Okay');

    }
}
function FormatDate(strDate) {
    var dateParts = strDate.split("/");
    var ActualDate = new Date(+dateParts[0], dateParts[1] - 1, +dateParts[2]);
    return ActualDate;
}