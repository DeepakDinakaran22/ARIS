$(document).ready(function () {

});

$(function () {
    $("#txtEmployeeName").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: '/Salary/Salary/AutoComplete',
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
                url: '/Salary/Salary/AutoCompleteENo',
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
function GetEmployeesSalaryBySearch() {
    var employeeName = $("#txtEmployeeName").val().trim().toLowerCase();
    var employeeNo = $("#txtEmployeeNumber").val().trim() == '' ? null : parseInt($("#txtEmployeeNumber").val().trim());
       var data = {
        EmployeeName: employeeName,
           EmployeeNo: employeeNo,
           };

    //isValid = isValidEntry();
    $.ajax({
        type: "GET",
        url: "/Salary/Salary/GetEmployeeSalary",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: data,
        success: function (response) {
            if (response != null) {
               populateSalary(response);
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
function populateSalary(response) {
    $("#txtEmployeeNumber").val(response[0]["employeeNo"]);
    $("#txtEmployeeName").val(response[0]["employeeName"]);
    $("#dpDocJoiningDate").val(response[0]["joiningDate"].replace('T00:00:00', ''));
    $("#txtBankAccountNumber").val(response[0]["bankAccountNumber"]);
    $("#txtOvertime").val(response[0]["overtimeOrExtraduty"]);
    $("#txtTranspotationallowance").val(response[0]["transpotationAllowance"]);
    $("#txtFoodallowance").val(response[0]["foodAllowance"]);
    $("#txtTelephoneallowance").val(response[0]["telephoneAllowance"]);
    $("#txtOtherallowance").val(response[0]["otherAllowance"]);
    $("#txtTaxicharges").val(response[0]["taxiCharges"]);
    $("#txtRoomrent").val(response[0]["roomRent"]);
    $("#txtServiceBenefits").val(response[0]["serviceBenefits"]);
    $("#txtSocialInsurance").val(response[0]["socialInsurance"]);
    $("#txtLeaveDeductions").val(response[0]["leaveDeduction"]);
    $("#txtAdvanceDeductions").val(response[0]["advanceDeduction"]);
    $("#txtOtherDeductions").val(response[0]["otherDeduction"]);


    CalculateTotals(response);
}
function CalculateTotals(response) {
    var overTime = parseInt($("#txtOvertime").val() == '' ? 0 : response[0]["overtimeOrExtraduty"]);
    var transpotationalAllowance = parseInt($("#txtTranspotationallowance").val() == '' ? 0 : $("#txtTranspotationallowance").val().trim());
    var foodAllowance = parseInt($("#txtFoodallowance").val() == '' ? 0 : $("#txtFoodallowance").val().trim());
    var telephoneallowance = parseInt($("#txtTelephoneallowance").val() == '' ? 0 : $("#txtTelephoneallowance").val().trim());
    var otherallowance = parseInt($("#txtOtherallowance").val() == '' ? 0 : $("#txtOtherallowance").val().trim());
    var taxicharges = parseInt($("#txtTaxicharges").val() == '' ? 0 : $("#txtTaxicharges").val().trim());
    var roomrent = parseInt($("#txtRoomrent").val().trim() == '' ? 0 : $("#txtRoomrent").val().trim());
    var serviceBenefits = parseInt($("#txtServiceBenefits").val().trim() == '' ? 0 : $("#txtServiceBenefits").val().trim());

    var totalAllowance = overTime + transpotationalAllowance + foodAllowance + telephoneallowance + otherallowance + taxicharges + roomrent + serviceBenefits;
    console.log(totalAllowance);
    $("#txtTotalallowance").val(totalAllowance);
    var socialInsurance = parseInt(response[0]["socialInsurance"] == null ? 0 : response[0]["socialInsurance"]);
    var leaveDeduction = parseInt(response[0]["leaveDeduction"] == null ? 0 : response[0]["leaveDeduction"]);
    var advanceDeduction = parseInt(response[0]["advanceDeduction"] == null ? 0 : response[0]["advanceDeduction"]);
    var otherDeduction = parseInt(response[0]["otherDeduction"] == null ? 0 : response[0]["otherDeduction"]);
    var totalDeductions = socialInsurance + leaveDeduction + advanceDeduction + otherDeduction;
    $("#txtTotalDeductions").val(totalDeductions);

    var basic = parseInt(response[0]["basic"] == null ? 0 : response[0]["basic"]);
    var grossSalary = totalAllowance + basic;
    $("#txtTotalGrossSalary").val(grossSalary);

    var netSalary = grossSalary - totalDeductions;
    $("#txtNetSalary").val(netSalary);


    $("#txtTotalSalaryPayment").val(netSalary);


}





