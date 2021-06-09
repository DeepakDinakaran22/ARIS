var row;
var table;
var empNO;
$(document).ready(function () {
    $("#btnUpdate").hide();
    $("#btnSubmit").show();
    getCompanies();
     GetAllEmployees();
    // GetEmployeeReferenceNo();
    $("#dpContractEndDate").datepicker({ minDate: 0 }); //maxDate: "+1M +15D" });
    $("#dpContractStartDate").datepicker({ minDate: 0 });
    $("#dpJoiningDateFrom").datepicker({ minDate: 0 });
    $("#dpJoiningDateTo").datepicker({ minDate: 0 });
    $("#dpResidentExpiryFrom").datepicker({ minDate: 0 });
    $("#dpResidentExpiryTo").datepicker({ minDate: 0 });
    $("#dpPassportExpiryFrom").datepicker({ minDate: 0 });
    $("#dpPassportExpiryTo").datepicker({ minDate: 0 });

    $('#tblEmployees').on('click', 'td.edit', function (e) {
        e.preventDefault();
        empNO = parseInt(table.row(this).data()['employeeNo']);
        $("#txtEmployeeNumber").val('ARIS-' + table.row(this).data()['employeeReferenceNo']);
        $("#txtEmployeeName").val(table.row(this).data()['employeeName']);
        $("#ddlCompany").val(table.row(this).data()['companyId']);
        $("#ddlCountry").val(table.row(this).data()['nationality']);
        $("#txtPassportNumber").val(table.row(this).data()['passportNumber']);
        $("#dpPassportExpiryDate").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['passportExpiryDate'].replace('T00:00:00', '')));
        $("#txtResidentNumber").val(table.row(this).data()['residentNumber']);
        $("#dpResidentExpiryDate").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['residentExpiryDate'].replace('T00:00:00', '')));
        $("#dpJoiningDate").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['joiningDate'].replace('T00:00:00', '')));
        $("#dpContractStartDate").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['contractStartDate'].replace('T00:00:00', '')));
        $("#dpContractEndDate").datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", table.row(this).data()['contractEndDate'].replace('T00:00:00', '')));
        $("#txtGsm").val(parseInt(table.row(this).data()['gsm']));
        $("#txtAccomodationDetails").val(table.row(this).data()['accomodationDetails']);
        $("input[name='radioMarital'][value='" + table.row(this).data()['maritalStatus'] + "']").prop('checked', true);
        $("#txtIdProfession").val(table.row(this).data()['idProfession']);
        $("#txtDesignation").val(table.row(this).data()['designation']);
        $("#txtBankName").val(table.row(this).data()['bankName']);
        $("#txtAccountNumber").val(table.row(this).data()['bankAccountNumber']);
        $("#txtRemarks").val(table.row(this).data()['remarks']);


        $("#btnUpdate").show();
        $("#btnSubmit").hide();

    });


});

function getCompanies() {
    try {
        bindDropDownList('ddlCompany', 'GET', '/MasterPages/ManageEmployees/GetCompanies', 'json', 'companyId', 'companyName');

    }
    catch (err) {
        console.log(err);
    }
}

function SearchRequest() {
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
        Remarks: remarks
    };

    isValid = isValidEntry();


    if (isValid) {
        callAjax('POST', '/Reports/ManageEmployees/SearchRequest', data);
        GetAllEmployees();
        ClearFields();
    }
    else {

    }



}

function isValidEntry() {
    var valid = true;

    if ($('#txtEmployeeName').val() == '') {
        $('#txtEmployeeName').css('border-color', 'red');
        valid = false;
    }
    else {
        $('#txtEmployeeName').css('border-color', '');
    }
    if ($("#ddlCompany").val() == 0) {
        $('#ddlCompany').css('border-color', 'red');
        valid = false;
    }
    else {
        $('#ddlCompany').css('border-color', '');
    }
    if ($("#ddlCountry").val() == -1) {
        $('#ddlCountry').css('border-color', 'red');
        valid = false;
    }
    else {
        $('#ddlCountry').css('border-color', '');
    }
    if ($("#txtPassportNumber").val() == '') {
        $('#txtPassportNumber').css('border-color', 'red');
        valid = false;
    }
    else {
        $('#txtPassportNumber').css('border-color', '');
    }
    if ($("#dpPassportExpiryDate").val() == '') {
        $('#dpPassportExpiryDate').css('border-color', 'red');
        valid = false;
    }
    else {
        $('#dpPassportExpiryDate').css('border-color', '');
    }
    if ($("#txtResidentNumber").val() == '') {
        $('#txtResidentNumber').css('border-color', 'red');
        valid = false;
    }
    else {
        $('#txtResidentNumber').css('border-color', '');
    }
    if ($("#dpResidentExpiryDate").val() == '') {
        $('#dpResidentExpiryDate').css('border-color', 'red');
        valid = false;
    }
    else {
        $('#dpResidentExpiryDate').css('border-color', '');
    }
    if ($("#dpJoiningDate").val() == '') {
        $('#dpJoiningDate').css('border-color', 'red');
        valid = false;
    }
    else {
        $('#dpJoiningDate').css('border-color', '');
    }
    if ($("#dpContractStartDate").val() == '') {
        $('#dpContractStartDate').css('border-color', 'red');
        valid = false;
    }
    else {
        $('#dpContractStartDate').css('border-color', '');
    }
    if ($("#dpContractEndDate").val() == '') {
        $('#dpContractEndDate').css('border-color', 'red');
        valid = false;
    }
    else {
        $('#dpContractEndDate').css('border-color', '');
    }
    if ($("#txtGsm").val() == '') {
        $('#txtGsm').css('border-color', 'red');
        valid = false;
    }
    else {
        $('#txtGsm').css('border-color', '');
    }
    if ($("#txtAccomodationDetails").val() == '') {
        $('#txtAccomodationDetails').css('border-color', 'red');
        valid = false;
    }
    else {
        $('#txtAccomodationDetails').css('border-color', '');

    }
    if ($("#txtIdProfession").val() == '') {
        $('#txtIdProfession').css('border-color', 'red');
        valid = false;
    }
    else {
        $('#txtIdProfession').css('border-color', '');
    }

    if ($("#txtDesignation").val() == '') {
        $('#txtDesignation').css('border-color', 'red');
        valid = false;
    }
    else {
        $('#txtDesignation').css('border-color', '');
    }
    if ($("#txtBankName").val() == '') {
        $('#txtBankName').css('border-color', 'red');
        valid = false;
    }
    else {
        $('#txtBankName').css('border-color', '');
    }

    if ($("#txtAccountNumber").val() == '') {
        $('#txtAccountNumber').css('border-color', 'red');
        valid = false;
    }
    else {
        $('#txtAccountNumber').css('border-color', '');
    }


    return valid;
}

function GetAllEmployees() {
    $.ajax({
        type: "GET",
        url: "/Reports/Reports/GetAllEmployeeReports",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null) {
                populateEmployees(response);
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
function populateEmployees(response) {
    table = $('#tblEmployeeReports').DataTable(
        {
            dom: 'Bfrtip',
            buttons: [
                'copyHtml5',
                'excelHtml5',
                'csvHtml5',
                //'pdfHtml5'
            ],
            bLengthChange: false,
            bFilter: true,
            bSort: true,
            bPaginate: true,
            data: response,
            scrollX: true,
            scrollY: true,
            select: true,
            pageLength: 10,
            destroy: true,
            //  columnDefs: [ { width: 90, targets: 0 } ],
            columns: [
                {
                    data: 'employeeNo', title: 'Employee Number', visible: false,
                },
                {
                    data: 'employeeReferenceNo', title: 'Employee No.', class:'text-center',
                    render: function (data) {
                        return 'Aris-' + data;
                    }
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
                {
                    data: 'employeeName', title: 'Employee Name'
                },
                {
                    data: 'companyName', title: 'Company Name'
                },
                {
                    data: 'passportNumber', title: 'Passport Number'
                },
                {
                    data: 'passportExpiryDate', title: 'Passport Expiry Date',
                    render: function (data) {
                        var dt = new Date(data);
                        return dt.toLocaleDateString();
                    }
                },
                {
                    data: 'residentNumber', title: 'Resident Number'
                },
                {
                    data: 'residentExpiryDate', title: 'Resident Expiry Date',
                    render: function (data) {
                        var dt = new Date(data);
                        return dt.toLocaleDateString();
                    }
                },
                {
                    data: 'joiningDate', title: 'Joining Date'
                    ,
                    render: function (data) {
                        var dt = new Date(data);
                        return dt.toLocaleDateString();
                    }
                },
                {
                    data: 'contractStartDate', title: 'Contract Start Date',
                    render: function (data) {
                        var dt = new Date(data);
                        return dt.toLocaleDateString();
                    }
                },
                {
                    data: 'contractEndDate', title: 'Contract End Date',
                    render: function (data) {
                        var dt = new Date(data);
                        return dt.toLocaleDateString();
                    }
                },
                {
                    data: 'gsm', title: 'Gsm '
                },
                {
                    data: 'accomodationDetails', title: 'Accomodation Details '
                },
                {
                    data: 'maritalStatus', title: 'Marital Status',
                    render: function (data) {
                        if (data == 0) {
                            return 'UnMarried';
                        }
                        else {
                            return 'Married';
                        }
                    }
                },
                {
                    data: 'idProfession', title: 'ID Profession'
                },
                {
                    data: 'designation', title: 'Designation'
                },
                {
                    data: 'bankName', title: 'Bank Name'
                },
                {
                    data: 'bankAccountNumber', title: 'BankAccountNumber'
                },
                {
                    data: 'remarks', title:'Last Remarks'
                }
                
                
                //{
                //    data: null,
                //    title: 'View',
                //    class: 'edit',
                //    defaultContent: '<button type="button" class="btn btn-success"><i class="fas fa-edit"></i></button>',
                //    orderable: false
                //}
            ],
            rowCallback: function (row, data) {

                if (data.approvalStatus == 0) {
                    $('td', row).css('background-color', '#FFFEEA');

                    //$('td:eq(6)', row).html('<span class="label label-success">OPERATIVO</span>');
                }
                else if (data.approvalStatus == 2) {
                    $('td', row).css('background-color', '#DFFFE1');
                }
                else {
                    $('td', row).css('background-color', '#FFD9D9');

                }
            }
        });

}

function GetAllEmployeesBySearch() {
    var employeeName = $("#txtEmployeeName").val().trim().toLowerCase();
    var employeeReferenceNo = $("#txtEmployeeNumber").val().trim()==''?null: parseInt($("#txtEmployeeNumber").val().trim());
    var companyId = $("#ddlCompany option:selected").val()==0?null: $("#ddlCompany option:selected").val();
    var approvalStatus = $("#ddlApprovalStatus option:selected").val() == -1 ? null : $("#ddlApprovalStatus option:selected").val();

    //var nationality = $("#ddlCountry option:selected").val();
    //var passportNumber = $("#txtPassportNumber").val();
    //var passportExpiryDate = $("#dpPassportExpiryDate").val() != '' ? $("#dpPassportExpiryDate").datepicker('getDate').toLocaleString() : '';
    //var residentNumber = $("#txtResidentNumber").val();
    //var residentExpiryDate = $("#dpResidentExpiryDate").val() != '' ? $("#dpResidentExpiryDate").datepicker('getDate').toLocaleString() : '';
    //var joiningDate = $("#dpJoiningDate").val() != '' ? $("#dpJoiningDate").datepicker('getDate').toLocaleString() : '';
    //var contractStartDate = $("#dpContractStartDate").val() != '' ? $("#dpContractStartDate").datepicker('getDate').toLocaleString() : '';
    //var contractEndDate = $("#dpContractEndDate").val() != '' ? $("#dpContractEndDate").datepicker('getDate').toLocaleString() : '';
    //var gsm = $("#txtGsm").val();
    //var accomodationDetails = $("#txtAccomodationDetails").val();
    //var maritalStatus = $("input[name='radioMarital']:checked").val();
    //var idProfession = $("#txtIdProfession").val();
    //var designation = $("#txtDesignation").val();
    //var bankName = $("#txtBankName").val();
    //var bankAccountNumber = $("#txtAccountNumber").val();
    //var remarks = $("#txtRemarks").val();

    var data = {
        EmployeeName: employeeName,
        EmployeeReferenceNo: employeeReferenceNo,
        CompanyId: companyId,
        ApprovalStatus: approvalStatus
        //Nationality: nationality,
        //PassportNumber: passportNumber,
        //PassportExpiryDate: passportExpiryDate,
        //ResidentNumber: residentNumber,
        //ResidentExpiryDate: residentExpiryDate,
        //JoiningDate: joiningDate,
        //ContractStartDate: contractStartDate,
        //ContractEndDate: contractEndDate,
        //Gsm: gsm,
        //AccomodationDetails: accomodationDetails,
        //MaritalStatus: maritalStatus,
        //IdProfession: idProfession,
        //Designation: designation,
        //BankName: bankName,
        //BankAccountNumber: bankAccountNumber,
        //Remarks: remarks
    };

    //isValid = isValidEntry();
    $.ajax({
        type: "GET",
        url: "/Reports/Reports/GetAllEmployeeReports",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: data,
        success: function (response) {
            if (response != null) {
                populateEmployees(response);
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
$(function () {
    $("#txtEmployeeName").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: '/Reports/Reports/AutoComplete',
                data: { "prefix": $("#txtEmployeeName").val().trim() },
                type: "POST",
                success: function (data) {
                    response($.map(data, function (item) {
                        return item;
                    }))
                },
                error: function (response) {
                    console.log(response.responseText);
                },
                failure: function (response) {
                    console.log(response.responseText);
                }
            });
        },
        minLength: 1
    });
});
$(function () {
    $("#txtEmployeeNumber").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: '/Reports/Reports/AutoCompleteNumber',
                data: { "prefix": $("#txtEmployeeNumber").val().trim() },
                type: "POST",
                success: function (data) {
                    response($.map(data, function (item) {
                        return item;
                    }))
                },
                error: function (response) {
                    console.log(response.responseText);
                },
                failure: function (response) {
                    console.log(response.responseText);
                }
            });
        },
        minLength: 1
    });
});