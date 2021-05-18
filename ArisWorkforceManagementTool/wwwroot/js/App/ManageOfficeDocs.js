var table;
var officeDocId;

$(document).ready(function () {

    showLoader(true);
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
        }
        else {
            $("#files").attr("disabled", false);
            CheckNameExists();

        }

    });
   
});
$('#tblOfficeDoc').on('click', 'td.edit', function(e) {
    e.preventDefault();
    $("#ddlDocument").val(table.row(this).data()['documentId']).attr("disabled", "disabled");;
    $("#txtOfficeDocDesc").val(table.row(this).data()['officeDocDesc']).attr("disabled", false);
    $("#dpDocIssueDate").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['docIssueDate'].replace('T00:00:00', '')));
    $("#dpDocExpiryDate").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['docExpiryDate'].replace('T00:00:00', '')));
    if (table.row(this).data()['isActive'] == 1) {
        $("#ddlStatus").val(1);
    }
    else {
        $("#ddlStatus").val(0);
    }
    officeDocId = table.row(this).data()['officeDocId'];
    $("#btnUpdate").show();
    $("#btnSubmit").hide();
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
            select: true,
            pageLength: 10,
            destroy: true,
            columns: [
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
                    render: function(data) {
                        return data.replace('T00:00:00', '');
                    }
                },
                {
                    data: 'docExpiryDate', title: 'Expiry Date',
                    render: function(data) {
                        return data.replace('T00:00:00', '');
                    }
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
                        showAlert({ title: "Warning!", message: 'Document name exists!', type: "WARNING" });
                    }
                    else {
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

    if ($("#ddlDocument").val() == 0) {
        $('#ddlDocument').css('border-color', 'red');
        valid = false;
    }
    else {
        $('#ddlDocument').css('border-color', '');
    }
   
    if ($("#dpDocIssueDate").val() == '') {
        $('#dpDocIssueDate').css('border-color', 'red');
        valid = false;
    }
    else {
        $('#dpDocIssueDate').css('border-color', '');
    }
    if ($("#dpDocExpiryDate").val() == '') {
        $('#dpDocExpiryDate').css('border-color', 'red');
        valid = false;
    }
    else {
        $('#dpDocExpiryDate').css('border-color', '');
    }
    if ($("#ddlStatus").val() == -1) {
        $('#ddlStatus').css('border-color', 'red');
        isValid = false;
    }
    else {
        $('#ddlStatus').css('border-color', '');

    }


    return valid;
}
function ClearFields() {
    try {
        $("#txtOfficeDocDesc").val('');
        $("#ddlDocument").val(0);
        $("#ddlStatus").val(-1);
        $("#dpDocIssueDate").attr("disabled", false);
        $('#dpDocExpiryDate').css('border-color', '');
        $("#ddlDocument").attr("disabled", false);
        $("#hdnUploadedFileName").val('');
        $("#files").val('');
        
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
                $("#hdnUploadedFileName").val(data.docFileName);
                console.log($("#hdnUploadedFileName").val());
            }
        }
    );
}


