var userRole;
var loggedInUserId;

$(document).ready(function () {
    userRole = $("#hdnUserRole").val();
    loggedInUserId = $("#hdnUserId").val();
    GetDashboardValuesHomeLanding();

});
function GetDashboardValuesHomeLanding() {
    $.ajax({
        type: "GET",
        url: "/Home/GetDashboardValuesHomeLanding",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.isRedirect) {
                window.location.href = response.redirectUrl;
            }
            $("#lblActiveEmployees").text(response.active);
            $("#lblPendingRequests").text(response.pending);
            $("#lblSentBackReq").text(response.sendBack);
            $("#lblModificationReq").text(response.modificaiton);


        },
        failure: function (response) {
            console.log(response.responseText);


        },
        error: function (response) {

            console.log(response.responseText);
        }
    });
}