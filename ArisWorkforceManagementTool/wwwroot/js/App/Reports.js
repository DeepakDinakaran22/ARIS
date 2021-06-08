var row;
var table;
var empNO;
$(document).ready(function () {
    $("#btnUpdate").hide();
    $("#btnSubmit").show();
    getCompanies();
    // GetAllEmployees();
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
        callAjax('POST', '/MasterPages/ManageEmployees/SearchRequest', data);
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
        url: "/MasterPages/ManageEmployees/GetAllEmployees",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null) {
                populateEmployees(response);
            } else {
                alert("Something went wrong");
            }
        },
        failure: function (response) {
            alert(response.responseText);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}
function populateEmployees(response) {
    table = $('#tblEmployees').DataTable(
        {
            bLengthChange: true,
            bFilter: true,
            bSort: true,
            bPaginate: true,
            data: response,
            scrollX: false,
            scrollY: false,
            select: true,
            pageLength: 10,
            destroy: true,
            //  columnDefs: [ { width: 90, targets: 0 } ],
            columns: [
                {
                    data: 'employeeNo', title: 'Employee Number', visible: false,
                },
                {
                    data: 'employeeName', title: 'Employee Name'
                },
                {
                    data: 'approvalStatus', title: 'Status',
                    render: function (data) {
                        if (data == 1) {
                            return 'Approved';
                        }
                        else {
                            return 'Pending';
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
