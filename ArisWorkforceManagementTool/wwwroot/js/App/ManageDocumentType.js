﻿var row;
var table;
var documentID;
var isValidDoc = false;
$(document).ready(function () {
    getCategories();
    $("#btnUpdate").hide();
    $("#btnSubmit").show();
    //showAlert({ title: "SUCCESS!", message: 'Action has been completed successfully!', type: "SUCCESS" });
    GetAllDocuments();

    $("#txtDocumentName").focusout(function () {
        if ($("#txtDocumentName").val() != '' && $("#ddlDocumentType option:selected").val() != 0) {
            CheckNameExists();
        }
    });
    $("#ddlDocumentType").focusout(function () {
        if ($("#ddlDocumentType option:selected").val() != 0 && $("#txtDocumentName").val() != '') {
            CheckNameExists();
        }
    });

    $('#tblDocuments').on('click', 'td.edit', function (e) {
        e.preventDefault();
        ResetFields();
        $("#txtDocumentName").val(table.row(this).data()['documentName']).attr("disabled", "disabled");;
        $("#txtDocumentDesc").val(table.row(this).data()['documentDescription']);
        $("#ddlDocumentType").val(table.row(this).data()['documentCategoryID']).attr("disabled", "disabled");;
        if (table.row(this).data()['isActive'] == 1) {
            $("#ddlStatus").val(1);
        }
        else {
            $("#ddlStatus").val(0);
        }
        if (table.row(this).data()['isExpiryRequired'] == 1) {
            $("#ddlIsExpiry").val(1);
        }
        else {
            $("#ddlIsExpiry").val(0);
        }
        if (table.row(this).data()['isMandatory'] == 1) {
            $("#ddlMandatory").val(1);
        }
        else {
            $("#ddlMandatory").val(0);
        }
        documentID = table.row(this).data()['documentId'];

        $("#btnUpdate").show();
        $("#btnSubmit").hide();
        $(window).scrollTop(0);

    });

    //validation


    //ready end
});
function CheckNameExists() {
    try {

        $.ajax({
            type: "GET",
            url: "/MasterPages/ManageDocuments/IsDocumentNameExists",
            data: { DocumentName: $("#txtDocumentName").val().trim(), DocumentCategoryID: $("#ddlDocumentType option:selected").val() },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null) {
                    if (response.value == true) {
                        isValidDoc = false;
                        $('#txtDocumentName').css('border-color', 'red');
                        $('#ddlDocumentType').css('border-color', 'red');
                        //showAlert({ title: "Warning!", message: 'Document Name is already added!', type: "WARNING" });
                        MessageBox('Exists!', 'fa fa-file', 'Document is already added!', 'orange', 'btn btn-warning', 'Okay');
                    }
                    else {
                        isValidDoc = true;
                        $('#txtDocumentName').css('border-color', '');
                        $('#ddlDocumentType').css('border-color', '');


                    }

                } else {
                    console.log("Something went wrong");
                }
            },
            failure: function (response) {
                // alert(response.responseText);
            },
            error: function (response) {
                // alert(response.responseText);
            }
        });
    }
    catch (err) {

    }
}
function SubmitRequest() {
    var docName = $("#txtDocumentName").val().trim();
    var docDesc = $("#txtDocumentDesc").val().trim();
    var docType = $("#ddlDocumentType option:selected").val();
    var isActive = $("#ddlStatus option:selected").val();
    var IsExpiryRequired = $("#ddlIsExpiry option:selected").val();
    var isMandatory = $("#ddlMandatory option:selected").val();

    var data = {
        DocumentName: docName,
        DocumentDescription: docDesc,
        DocumentCategoryID: docType,
        IsActive: isActive,
        IsExpiryRequired: IsExpiryRequired,
        IsMandatory: isMandatory
    };



    if (isValidEntry()) {

        callAjax('POST', '/MasterPages/ManageDocuments/SubmitRequest', data);
        GetAllDocuments();
        ResetFields();
    }
    else {

    }



}
function UpdateRequest() {
    try {
        var docName = $("#txtDocumentName").val().trim();
        var docDesc = $("#txtDocumentDesc").val().trim();
        var docType = $("#ddlDocumentType option:selected").val();
        var isActive = $("#ddlStatus option:selected").val();
        var IsExpiryRequired = $("#ddlIsExpiry option:selected").val();
        var isMandatory = $("#ddlMandatory option:selected").val();


        var data = {
            DocumentName: docName,
            DocumentDescription: docDesc,
            DocumentCategoryID: docType,
            IsActive: isActive,
            DocumentId: documentID,
            IsExpiryRequired: IsExpiryRequired,
            IsMandatory: isMandatory

        };




        isValidDoc = true;
        if (isValidEntry()) {

            callAjax('POST', '/MasterPages/ManageDocuments/UpdateRequest', data);
            GetAllDocuments();
            ResetFields();
        }

    }
    catch (err) {
        console.log(err);
    }
}
//Fetch all data
function GetAllDocuments() {
    $.ajax({
        type: "GET",
        url: "/MasterPages/ManageDocuments/GetAllDocuments",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () { // Before we send the request, remove the .hidden class from the spinner and default to inline-block.
            // $('#modal-Loader').modal('show');
        },
        success: function (response) {
            if (response != null) {
                populateDocuments(response);
                // $('#modal-Loader').modal('hide');
            } else {
                alert("Something went wrong");
            }
        },
        complete: function () { // Set our complete callback, adding the .hidden class and hiding the spinner.
            //  $('#modal-Loader').modal('hide');

        },
        failure: function (response) {
            console.log(response.responseText);
        },
        error: function (response) {
            console.log(response.responseText);
        }
    });
}
function populateDocuments(response) {

    table = $('#tblDocuments').DataTable(
        {
            bLengthChange: true,
            bFilter: true,
            bSort: true,
            bPaginate: true,
            data: response,
            //scrollY: true,
            ScrollX: false,//"100%",
            //scrollCollapse: true,
            select: true,
            pageLength: 10,
            destroy: true,
            order: [[1, "desc"]],
            columns: [
                {
                    data: null,
                    title: 'View',
                    class: 'edit',
                    defaultContent: '<button type="button" class="btn btn-sm btn-success"><i class="fas fa-edit"></i></button>',
                    orderable: false
                },
                {
                    data: 'documentId', title: 'Document ID', visible: false,
                },
                {
                    data: 'documentName', title: 'Document Name'
                },
                {
                    data: 'documentDescription', title: 'Document Description'
                },
                {
                    data: 'isExpiryRequired', title: 'Expiry Date?',
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
                    data: 'isMandatory', title: 'Mandatory?',
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
                    data: 'documentCategoryID', title: 'Document Type',
                    render: function (data) {
                        if (data == '1') {
                            return 'Employee Documents';
                        }
                        else if (data == '2') {
                            return 'Office Documents';
                        }
                        else if (data == '3') {
                            return 'Client Documents';
                        }
                        else if (data == '4') {
                            return 'Confidential';
                        }
                    }
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
function ResetFields() {
    try {
        $("#txtDocumentName").val('');
        $("#txtDocumentDesc").val('');
        $("#ddlStatus").val(-1);
        $("#ddlDocumentType").val(0);
        $("#txtDocumentName").attr("disabled", false);
        $("#ddlDocumentType").attr("disabled", false);
        $('#txtDocumentName').css('border-color', '');
        $('#ddlDocumentType').css('border-color', '');
        $('#ddlStatus').css('border-color', '');
        $('#ddlIsExpiry').css('border-color', '');
        $("#ddlIsExpiry").val(-1);
        $('#ddlMandatory').css('border-color', '');
        $("#ddlMandatory").val(-1);
        isValidDoc = false;


        $("#btnUpdate").hide();
        $("#btnSubmit").show();
    }
    catch (err) {
        console.log(err);
    }
}
function getCategories() {
    try {
        bindDropDownList('ddlDocumentType', 'GET', '/MasterPages/ManageDocuments/GetCategories', 'json', 'documentCategoryID', 'documentCategoryName');

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

    if ($('#txtDocumentName').val() == '') {
        $('#txtDocumentName').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Document Name </br>';
    }
    else {
        $('#txtDocumentName').css('border-color', '');
    }
    if ($("#ddlDocumentType").val() == 0) {
        $('#ddlDocumentType').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Document Type </br>';
    }
    else {
        $('#ddlDocumentType').css('border-color', '');
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
    if ($("#ddlIsExpiry").val() == -1) {
        $('#ddlIsExpiry').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Is Expiry Required </br>';
    }
    else {
        $('#ddlIsExpiry').css('border-color', '');
    }
    if ($("#ddlMandatory").val() == -1) {
        $('#ddlMandatory').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Is Mandatory </br>';
    }
    else {
        $('#ddlMandatory').css('border-color', '');
    }

    if (!isValidDoc) {
        valid = false;
        count = count + 1;
        message += count + '. Valid Document Name & Doc Type </br>';
        $('#txtDocumentName').css('border-color', 'red');
        $('#ddlDocumentType').css('border-color', 'red');
    }
    else {
        $('#txtDocumentName').css('border-color', '');
        $('#ddlDocumentType').css('border-color', '');

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

$("#txtDocumentName").keyup(function () {
    if ($("#txtDocumentName").val() != '') {
        $('#txtDocumentName').css('border-color', '');

    }
});
$("#ddlDocumentType").change(function () {
    if ($("#ddlDocumentType option:selected").val() != 0) {
        $('#ddlDocumentType').css('border-color', '');

    }
});
$("#ddlStatus").change(function () {
    if ($("#ddlStatus option:selected").val() != -1) {
        $('#ddlStatus').css('border-color', '');

    }
});
$("#ddlIsExpiry").change(function () {
    if ($("#ddlIsExpiry option:selected").val() != -1) {
        $('#ddlIsExpiry').css('border-color', '');

    }
});
$("#ddlMandatory").change(function () {
    if ($("#ddlMandatory option:selected").val() != -1) {
        $('#ddlMandatory').css('border-color', '');

    }
});