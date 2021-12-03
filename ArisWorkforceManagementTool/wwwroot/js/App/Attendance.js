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
    //var employeeName = $("#txtEmployeeName").val().trim().toLowerCase();
    var employeeReferenceNo = $("#txtEmployeeNumber").val().trim() == '' ? null : parseInt($("#txtEmployeeNumber").val().trim());
       var data = {
       // EmployeeName: employeeName,
        EmployeeReferenceNo: employeeReferenceNo,
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
               // populateEmployees(response);
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


