var attendanceId = 0;
$(document).ready(function () {
    $("#spnHeader").text(new Date().getFullYear());
    $("#spnAnnualLeave").text(new Date().getFullYear());
    $("#spnBalanceLv").text(new Date().getFullYear() - 1);
    $("#spnTotallev").text(new Date().getFullYear());
    $("#spnLevTake").text(new Date().getFullYear());
    $("#spnLevBalance").text(new Date().getFullYear());
    ///Text change 
   
});

$(function () {
    $("#txtEmployeeName").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: '/Attendance/Attendance/AutoComplete',
                data: { "prefix": $("#txtEmployeeName").val().trim() },
                type: "POST",
                success: function (data) {
                    response($.map(data, function (item) {
                        return item;
                    }))
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
                url: '/Attendance/Attendance/AutoCompleteENo',
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
function GetEmployeesAttendanceBySearch() {
    if ($("#txtEmployeeNumber").val().trim() == '') {
        MessageBox('Required!', 'fa fa-warning', 'You must enter an employee number to continue!', 'red', 'btn btn-danger', 'Okay');
    }
    else {


        var employeeName = $("#txtEmployeeName").val().trim().toLowerCase();
        var employeeNo = $("#txtEmployeeNumber").val().trim() == '' ? null : parseInt($("#txtEmployeeNumber").val().trim());
        var data = {
            EmployeeName: employeeName,
            EmployeeNo: employeeNo,
        };

        //isValid = isValidEntry();
        $.ajax({
            type: "GET",
            url: "/Attendance/Attendance/GetEmployeeAttendance",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: data,
            success: function (response) {
                if (response != null) {
                    populateAttendance(response);
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
}
function populateAttendance(response) {
    $("#txtEmployeeNumber").val(response[0]["employeeNo"]);
    $("#txtEmployeeName").val(response[0]["employeeName"]);
    $("#dpDocJoiningDate").val(response[0]["joiningDate"].replace('T00:00:00', ''));
    $("#txtAnnualLeave").val(response[0]["annualLeave"]);
    $("#txtBalanceLeave").val(response[0]["balanceLeave"]);
    $("#txtTotalLeave").val(response[0]["totalLeave"]);
    $("#txtLeaveTaken").val(response[0]["leaveTaken"]);
    $("#txtSickLeaveJustified").val(response[0]["sickLeaveJustified"]);
    $("#txtNonJustifiedLeave").val(response[0]["nonJustifiedLeave"]);
    $("#txtUnpaidLeave").val(response[0]["unpaidLeave"]);
    $("#txtSickLeaveBalance").val(response[0]["sickLeaveBalance"]);
    $("#txtLeaveBalance").val(response[0]["leaveBalance"]);
    attendanceId = response[0]["attendanceId"];
   
}
function ResetFields() {
    $("#txtEmployeeName").val('');

    $('#txtEmployeeNumber').val('');
    $('#dpDocJoiningDate').val('');

    $('#txtAnnualLeave').val('');

    $('#txtBalanceLeave').val('');

    $('#txtTotalLeave').val('');

    $('#txtLeaveTaken').val('');

    $('#txtSickLeaveJustified').val('');

    $('#txtNonJustifiedLeave').val('');
    $('#txtUnpaidLeave').val('');
    //$("input[name='radioMarital']").prop('checked', false).attr('disabled', false);


    $('#txtSickLeaveBalance').val('');

    $('#txtLeaveBalance').val('');

    //$('#txtBankName').val('');

    //$('#txtAccountNumber').val('');
    //$('#txtConfirmAccountNumber').val('');

    //$("#hdnEmployeePicturePath").val('');
    //$("#imgUser").attr('src', "/img/avatar.png");
    //$("#files").val(null);
    $("#txtRemarks").val('');
    $("#btnUpdate").hide();
    $("#btnSubmit").show();
   

    //if (userRole == '2') {
    //    $("#btnUpdate").hide();
    //    $("#btnSubmit").hide();
    //    $("#btnSendBack").hide();
    //    $("#btnApprove").hide();
    //    $("#btnReset").hide();
    //    $("#txtEmployeeNumber").val('');
    //}
    //else {

    //}
}
function SubmitAttendance() {
    var isValid = true;
    var employeeName = $("#txtEmployeeName").val();
    var employeeNo = parseInt($("#txtEmployeeNumber").val().replace('ARIS-', ''));
    var annualLeave = $("#txtAnnualLeave").val();
    var balanceLeave = $("#txtBalanceLeave").val();
    var joiningDate = $("#dpJoiningDate").val() != '' ? $("#dpJoiningDate").datepicker('getDate').toLocaleString() : '';
    var totalLeave = $("#txtTotalLeave").val();
    var leaveTaken = $("#txtLeaveTaken").val();
    var sickLeaveJustified = $("#txtSickLeaveJustified").val();
    var nonJustifiedLeave = $("#txtNonJustifiedLeave").val();
    var unpaidLeave = $("#txtUnpaidLeave").val();
    var leaveBalance = $("#txtLeaveBalance").val();
    var sickLeaveBalance = $("#txtSickLeaveBalance").val();
    var attId = attendanceId;

    var data = {
        EmployeeName: employeeName,
        EmployeeNo: employeeNo,
        AnnualLeave: annualLeave,
        BalanceLeave: balanceLeave,
        TotalLeave: totalLeave,
        LeaveTaken: leaveTaken,
        SickLeaveJustified: sickLeaveJustified,
        NonJustifiedLeave: nonJustifiedLeave,
        JoiningDate: joiningDate,
        UnpaidLeave: unpaidLeave,
        LeaveBalance:leaveBalance,
        SickLeaveBalance: sickLeaveBalance,
        AttendanceId : attId,
        
    };
    console.log(data);
    isValid = isValidEntry();
    if (isValid) {
        

            callAjax('POST', '/Attendance/Attendance/SubmitAttendance', data);
            //GetAllEmployees();
            ResetFields();
        
    }
    else {
    }
}

function isValidEntry() {
    var valid = true;
    var message = '';
    var count = 0;

    if ($('#txtAnnualLeave').val() == '') {
        $('#txtAnnualLeave').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '.  Annual Leave </br>';
    }
    else {
        $('#txtAnnualLeave').css('border-color', '');
    }
    if ($("#txtBalanceLeave").val() == '') {
        $('#txtBalanceLeave').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Balance Leave  </br>';
    }
    else {
        $('#txtBalanceLeave').css('border-color', '');
    }
    if ($("#txtTotalLeave").val() == -1) {
        $('#txtTotalLeave').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Total Leave </br>';
    }
    else {
        $('#txtTotalLeave').css('border-color', '');
    }
    if ($("#txtLeaveTaken").val() == '') {
        $('#txtLeaveTaken').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. Leave Taken </br>';
    }
    else {
        $('#txtLeaveTaken').css('border-color', '');
    }
    if ($("#txtSickLeaveJustified").val() == '') {
        $('#txtSickLeaveJustified').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. SickLeave Justified </br>';
    }
    else {
        $('#txtSickLeaveJustified').css('border-color', '');
    }
    if ($("#txtNonJustifiedLeave").val() == '') {
        $('#txtNonJustifiedLeave').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '. NonJustified Leave </br>';
    }
    else {
        $('#txtNonJustifiedLeave').css('border-color', '');
    }
    if ($("#txtUnpaidLeave").val() == '')  {
        $('#txtUnpaidLeave').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '.  Unpaid Leave </br>';

    }
    else {
        $('#txtUnpaidLeave').css('border-color', '');
    }

    if ($("#txtSickLeaveBalance").val() == '')  {
        $('#txtSickLeaveBalance').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '.   SickLeave Balance </br>';

    }
    else {
        $('#txtSickLeaveBalance').css('border-color', '');
    }
    if ($("#txtLeaveBalance").val() == '')  {
        $('#txtLeaveBalance').css('border-color', 'red');
        valid = false;
        count = count + 1;
        message += count + '.   Leave Balance </br>';

    }
    else {
        $('#txtLeaveBalance').css('border-color', '');
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






