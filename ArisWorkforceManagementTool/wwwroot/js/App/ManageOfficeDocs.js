var table;
var officeDocId;
var userRole;
var loggedInUserId;
var tbl_docUpload;
var counter = 1000;
var isValidName = false;
var isExp = false;
$(document).ready(function () {

    showLoader(true);
    userRole = $("#hdnUserRole").val();
    loggedInUserId = $("#hdnUserId").val();
    $("#divUploadFile").hide();
    $("#dpDocIssueDate").datepicker({ minDate: 0 }); //maxDate: "+1M +15D" });
    $("#dpDocExpiryDate").datepicker({ minDate: 0 });
    $("#btnUpdate").hide();
    $("#btnSubmit").show();
    getOfficeDocs();
    GetAllOfficeDocs();
    $("#ddlDocument").focusout(function() {
        
    });

    $("#ddlDocument").change(function () {
        if ($("#ddlDocument option:selected").val()==0) {
            $("#files").attr("disabled", "disabled");
            $("#divUploadFile").hide();
        }
        else {
            CheckExpiryDateRequirement();
            GetAllUploads();
            $("#files").attr("disabled", false);
            CheckNameExists();
            $("#divUploadFile").show();
          
        }

    });
    deleteInvalidDocUploads();// delete invalidUploads
   
});
$('#tblOfficeDoc').on('click', 'td.edit', function(e) {
    e.preventDefault();
    ClearFields();
    
    $("#divUploadFile").show();

    $("#ddlDocument").val(table.row(this).data()['documentId']).attr("disabled", "disabled");;
    CheckExpiryDateRequirement();// dependancy with ddlDocumentTypeId
    $("#txtOfficeDocDesc").val(table.row(this).data()['officeDocDesc']).attr("disabled", false);
    $("#dpDocIssueDate").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['docIssueDate'].replace('T00:00:00', '')));
    if (!isExp) {
        $("#dpDocExpiryDate").val('');
    }
    else {
        $("#dpDocExpiryDate").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['docExpiryDate'].replace('T00:00:00', '')));

    }
    if (table.row(this).data()['isActive'] == 1) {
        $("#ddlStatus").val(1);
    }
    else {
        $("#ddlStatus").val(0);
    }
    officeDocId = table.row(this).data()['officeDocId'];
    $("#btnUpdate").show();
    $("#btnSubmit").hide();
    GetAllUploads();
    $(window).scrollTop(0);


});

function populateOfficeDocs(response) {
    var docId = 0;
    table = $("#tblOfficeDoc").DataTable(
        {
            bLengthChange: false,
            bFilter: true,
            bSort: true,
            bPaginate: true,
            data: response,
            //scrollY: "650px",
            //sScrollX: "100%",
            scrollY: false,
            sScrollX: false,
            //scrollCollapse: true,
            order: [[1, "desc"]],
            select: true,
            pageLength: 10,
            destroy: true,
            columns: [
                {
                    data: null,
                    title: 'View',
                    class: 'edit',
                    defaultContent: '<button type="button" class="btn btn-sm btn-success"><i class="fas fa-edit"></i></button>',
                    orderable: false
                },
                {
                    data: 'officeDocId', title: 'Document ID', visible: false,
                    render: function (data) {
                        if (data != null) { docId = data; }
                        return data;
                    }

                },
                {
                    data: 'documentId', title: 'docId', visible: false,
                },
                {
                    data: 'officeDocDesc', title: 'doc Desc', visible: false,
                },
                {
                    data: 'documentName', title: 'Document Name',
                },
                {
                    data: 'docIssueDate', title: 'Issue Date',
                    render: function (data) {
                        if (data != null) {
                            return data.replace('T00:00:00', '');
                        }
                        else { return null;}
                    }
                },
                {
                    data: 'docExpiryDate', title: 'Expiry Date',
                    render: function(data) {
                        if (data != null) {
                            return data.replace('T00:00:00', '');
                        }
                        else { return 'No Expiry'; }                    }
                },
                {
                    data: 'isActive', title: 'Status',
                    render: function(data) {
                        if (data == 0) {
                            return 'Inacttive';
                        }
                        else {
                            return 'Active';
                        }
                    }
                }
                
               
            ],
            rowCallback: function (row, data) {
                if (data.docExpiryDate != null) {
                    var today = new Date();
                    var edate = new Date(data.docExpiryDate.replace('T00:00:00', ''));
                    if (today > edate) {
                        $('td:eq(3)', row).css('background-color', '#F83112');
                    }
                    else {

                    }
                }
                //if (data.approvalStatus == 0) {
                //    $('td', row).css('background-color', '#FFFEEA');
                //}
                
            }
        });

}
function SubmitRequest() {
    var isValid = true;
    var documentId = $("#ddlDocument option:selected").val();
    var officeDocDesc = $("#txtOfficeDocDesc").val().trim();
    var docIssueDate = $("#dpDocIssueDate").val() != '' ? $("#dpDocIssueDate").datepicker('getDate').toLocaleString() : '';
    var docExpiryDate = $("#dpDocExpiryDate").val() != '' ? $("#dpDocExpiryDate").datepicker('getDate').toLocaleString() : '';
    var isActive = $("#ddlStatus option:selected").val();
    //var fileName = $("#hdnUploadedFileName").val();
    
    // employee image
    // file uploads

    var data = {
        DocumentId: documentId,
        OfficeDocDesc: officeDocDesc,
        DocIssueDate: docIssueDate,
        DocExpiryDate: docExpiryDate,
        IsActive: isActive,
    };

    isValid = isValidEntry();
    if (isValid) {
        showLoader(true);
        callAjax('POST', '/MasterPages/ManageOfficeDocuments/SubmitRequest', data);
        GetAllOfficeDocs();
        ClearFields();
    }
    else {
    }
}
function UpdateRequest() {
    var isValid = true;
    
    var documentId = $("#ddlDocument option:selected").val();
    var officeDocDesc = $("#txtOfficeDocDesc").val().trim();
    var docIssueDate = $("#dpDocIssueDate").val() != '' ? $("#dpDocIssueDate").datepicker('getDate').toLocaleString() : '';
    var docExpiryDate = $("#dpDocExpiryDate").val() != '' ? $("#dpDocExpiryDate").datepicker('getDate').toLocaleString() : '';
    var isActive = $("#ddlStatus option:selected").val();

    var data = {
        OfficeDocId: officeDocId,
        DocumentId: documentId,
        OfficeDocDesc: officeDocDesc,
        DocIssueDate: docIssueDate,
        DocExpiryDate: docExpiryDate,
        IsActive: isActive,
    };
    isValidName = true;
    isValid = isValidEntry();
    if (isValid) {
        showLoader(true);
        callAjax('POST', '/MasterPages/ManageOfficeDocuments/UpdateRequest', data);
        GetAllOfficeDocs();
        ClearFields();
    }
    else {
    }
}
//download function for passport files
$('#tblOfficeDoc').on('click', 'td.download', function(e) {
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
//is confirm box clicked
$('.example-p-2').on('click', function () {
    $.confirm({
        title: 'Are you sure?',
        content: 'Are you sure to add this details to the system?',
        icon: 'fa fa-question-circle',
        animation: 'scale',
        closeAnimation: 'scale',
        opacity: 0.5,
        buttons: {
            'confirm': {
                text: 'Yes',
                btnClass: 'btn-blue',
                action: function() {
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
        content: 'Are you sure you want to update the existing details?',
        icon: 'fa fa-question-circle',
        animation: 'scale',
        closeAnimation: 'scale',
        opacity: 0.5,
        buttons: {
            'confirm': {
                text: 'Yes',
                btnClass: 'btn-blue',
                action: function () {
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
            url: "/MasterPages/ManageOfficeDocuments/IsDocumentExists",
            data: { DocumentId: $("#ddlDocument option:selected").val() },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null) {
                    if (response.value == true) {
                        $('#ddlDocument').css('border-color', 'red');
                        $("#dpDocExpiryDate").attr('disabled', false);

                       // showAlert({ title: "Warning!", message: 'Document name exists!', type: "WARNING" });
                        MessageBox('Exists!', 'fa fa-file', 'Document is already added!', 'orange', 'btn btn-warning', 'Okey');
                        isValidName = false;
                    }
                    else {
                        isValidName = true;
                        $('#ddlDocument').css('border-color', '');
                        
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
function CheckExpiryDateRequirement() {
    try {
       //showLoader(true);
        $.ajax({
            type: "GET",
            url: "/MasterPages/ManageOfficeDocuments/GetIsExpiryEnabled",
            data: { DocumentId: $("#ddlDocument option:selected").val() },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (response) {
                if (response != null) {
                    if (response.value == true) {
                        isExp = true;
                        $("#dpDocExpiryDate").attr('disabled', false);
                        return true;
                     }
                    else {
                        isExp = false;
                        $("#dpDocExpiryDate").attr('disabled', true);
                        return false;
                    } 
                  

                } else {
                    console.log("Something went wrong");
                }
            }
           
        });
    }
    catch (err) {

    }
}
function GetAllOfficeDocs() {
    showLoader(true);
    $.ajax({
        type: "GET",
        url: "/MasterPages/ManageOfficeDocuments/GetAllOfficeDocuments",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function() { 
        },
        success: function(response) {
            if (response != null) {
                populateOfficeDocs(response);
            } else {
                alert("Something went wrong");
            }
        },
        complete: function(response) {
            showLoader(false);
        },
        failure: function(response) {
            console.log(response.responseText);
        },
        error: function(response) {
            console.log(response.responseText);
        }
    });
}
function getOfficeDocs() {
    try {
        bindDropDownList('ddlDocument', 'GET', '/MasterPages/ManageOfficeDocuments/GetDocuments', 'json', 'documentId', 'documentName');
    }
    catch (err) {
        console.log(err);
    }
}
function isValidEntry() {
    var valid = true;
    var message = '';
    var count = 0;
    if (!isValidName) {
        $('#ddlDocument').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Document Name </br>';
    }
    else {
        $('#ddlDocument').css('border-color', '');
    }
    if ($("#ddlDocument").val() == 0) {
        $('#ddlDocument').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Document Name </br>';
    }
    else {
        $('#ddlDocument').css('border-color', '');
    }
   
    if ($("#dpDocIssueDate").val() == '') {
        $('#dpDocIssueDate').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Issue Date </br>';
    }
    else {
        $('#dpDocIssueDate').css('border-color', '');
    }
    if (isExp) {
        if ($("#dpDocExpiryDate").val() == '') {
            $('#dpDocExpiryDate').css('border-color', 'red');
            valid = false;
            count = count + 1;
            message += count + '. Expiry Date </br>';
        }
        else {
            $('#dpDocExpiryDate').css('border-color', '');
        }
    }
    if ($("#ddlStatus").val() == -1) {
        $('#ddlStatus').css('border-color', 'red');
        isValid = false;
        count = count + 1;
        message += count + '. Status </br>';
    }
    else {
        $('#ddlStatus').css('border-color', '');

    }

    if (!CheckMandatoryUploads()) {
        valid = false;
        count = count + 1;
        message += count + '. Upload All Mandatory Documents  </br>';
        $("#btnUploadDocs").css('border-color', 'red');
    }
    else {
        $("#btnUploadDocs").css('border-color', '');

    }
    
    var idate = new Date($("#dpDocIssueDate").val());
    var edate = new Date($("#dpDocExpiryDate").val());
    if (idate > edate) {
        valid = false;
        count = count + 1;
        message += count+ '. Expiry date should not be older that issue date';
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
function ClearFields() {
    try {
        $("#txtOfficeDocDesc").val('');
        $("#ddlDocument").val(0).attr('disabled',false);
        $("#ddlStatus").val(-1);
        $("#dpDocIssueDate").val('').attr("disabled", false);
        $('#dpDocExpiryDate').val('').css('border-color', '');
        $("#ddlDocument").attr("disabled", false);
        $("#hdnUploadedFileName").val('');
        $("#files").val('');
        $('#ddlDocument').css('border-color', '');
        $('#dpDocIssueDate').css('border-color', '');
        $('#dpDocExpiryDate').css('border-color', '');
        $('#ddlStatus').css('border-color', '');
        $("#btnUploadDocs").css('border-color', '');
        $("#divUploadFile").hide();
        $("#dpDocExpiryDate").attr('disabled', false);

        $("#btnUpdate").hide();
        $("#btnSubmit").show();
        
    }
    catch (err) {
        console.log(err);
    }
}



function uploadDocuments(inputId) {
    var docId = $("#ddlDocument option:selected").val();
    var input = document.getElementById(inputId);
    var files = input.files;
    var formData = new FormData();
    for (var i = 0; i != files.length; i++) {
        formData.append("files", files[i]);
    }
    formData.append("docId", docId);


    $.ajax(
        {
            url: "/MasterPages/ManageOfficeDocuments/UploadDocuments",
            data: formData,
            processData: false,
            contentType: false,
            type: "POST",
            async: false,
            success: function (data) {
                GetAllUploads();

                $("#hdnUploadedFileName").val(data.docFileName);
                
            }
        }
    );
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
        url: "/MasterPages/ManageOfficeDocuments/DeleteSelectedFiles",
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

function deleteInvalidDocUploads() {
    var userId = loggedInUserId; 
    $.ajax({
        type: "GET",
        url: "/MasterPages/ManageOfficeDocuments/DeleteInValidDocUploads",
        contentType: "application/json; charset=utf-8",
        data: { userId: userId },
        dataType: "json",
        success: function (response) {
            if (response != null) {

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

function GetAllUploads() {

    $.ajax({
        type: "GET",
        url: "/MasterPages/ManageOfficeDocuments/GetAllUploads",
        contentType: "application/json; charset=utf-8",
        data: { docId: $("#ddlDocument option:selected").val()},
        dataType: "json",
        success: function (response) {
            if (response != null) {
                pupulateUploadDocs(response);
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
function pupulateUploadDocs(response) {
    var docId = 0;
    var upldId = 0;
    var hasFile = false;
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
                    data:'docFileUploadId', visible: false,
                    render :function (data) {
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
                    data: 'filePath', title: 'File Path', visible: false,
                },
                {
                    data: 'documentName', title: 'Document Name', visible: false,
                },

                {
                    data: 'fileName', title: 'File Name', visible:true,
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
                        if (hasFile == false) {
                            return '<input type="file" multiple id="upload_' + docId + '" onchange="uploadDocuments(\'upload_' + docId + '\');">';
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
                         if (hasFile == false) {
                             return '<a href="#" hidden onclick="DeleteSelectedFiles(\'delete_' + upldId + '\');" id="delete_' + upldId + '"> Delete </a>';
                        }
                        else {
                             return '<a href="#" onclick="DeleteSelectedFiles(\'delete_' + upldId +'\');" id="delete_' + upldId + '"> Delete </a>';
                        }
                    }
                },
                
            ]
        });

}
//download function for passport files
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


//add new row to the table
$('#btnAddRow').on('click', function () {
    var tables= $('#tblUploadDocs').DataTable();
    tables.row.add({
        'docFileUploadId': null,
        'documentId': counter,
        'filePath': 'a',
        'documentName': 'b',
        'fileName': 'No File',
        'isMandatory': 'No',
        '': '<input type="file" multiple id="upload_' + $("#ddlDocument option:selected").val() + '" onchange="uploadDocuments(\'upload_' + $("#ddlDocument option:selected").val() + '\');">',

    }).draw(false);
    counter = counter + 1;
    
});

function CheckMandatoryUploads() {
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
// Validation additional effects
$("#dpDocIssueDate").change(function () {
    if ($("#dpDocIssueDate").val().trim() != '') {
        $('#dpDocIssueDate').css('border-color', '');

    }
});
$("#dpDocExpiryDate").change(function () {
    if ($("#dpDocExpiryDate").val().trim() != '') {
        $('#dpDocExpiryDate').css('border-color', '');

    }
});
$("#ddlStatus").change(function () {
    if ($("#ddlStatus option:selected").val() != -1) {
        $('#ddlStatus').css('border-color', '');

    }

});


