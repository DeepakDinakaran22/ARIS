$(document).ready(function () {
    $("#spnHeader").text(new Date().getFullYear());
    $("#spnAnnualLeave").text(new Date().getFullYear());
    $("#spnBalanceLv").text(new Date().getFullYear() - 1);
    $("#spnTotallev").text(new Date().getFullYear());
    $("#spnLevTake").text(new Date().getFullYear());
    $("#spnLevBalance").text(new Date().getFullYear());
                         
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