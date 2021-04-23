function callAjax(method, url, data, successCallbackFn, errorCallbackFn, bAsync = false, dataType = 'json') {
    var forgeryToken = $("input[name='__RequestVerificationToken']").val();
    try {
        $.ajax({
            type: method,
            url: url,
            cache: false,
            headers: { "__RequestVerificationToken": forgeryToken },
            //contentType: 'application/json',
            data: data,
            dataType: dataType,
            async: bAsync,
            success: function (response) {
                if (response.success == true) {
                    showAlert({ title: "SUCCESS!", message: response.responseText, type: "SUCCESS" });

                } else {
                    showAlert({ title: "ERROR!", message: response.responseText, type: "ERROR" });
                }
                
            },
            error: function (exception) {
                showAlert({ title: "ERROR!", message: response.responseText, type: "ERROR" });
            }
        });
    }
    catch (exception) {

    }
};


function httpFormPost(pData) {
   
return $.ajax({
type: 'POST',
url: window.location.origin + getRootFolderPath() + pData.api,
//data: JSON.stringify(pData.formData),
    data: pData.formData,
//contentType: 'application/json; charset=utf-8',
//dataType: 'json'
}).promise();
}
function httpGet(pData) {
return $.ajax({
type: 'GET',
url: window.location.origin + getRootFolderPath() + pData.api,
data: {},
contentType: 'application/json; charset=utf-8',
dataType: 'json'
}).promise();
}
function getRootFolderPath() {
    try {
        var _location = document.location.toString();
        var applicationNameIndex = _location.indexOf('/', _location.indexOf('://') + 3);
        var applicationName = _location.substring(0, applicationNameIndex) + '/';
        var webFolderIndex = _location.indexOf('/', _location.indexOf(applicationName) + applicationName.length);
        var webFolderFullPath = _location.substring(0, webFolderIndex);
        var rootFolderName = webFolderFullPath.replace(applicationName, "");

        if (rootFolderName.toLocaleLowerCase() == "ARIS") {
            return "/" + rootFolderName;
        }
        else {
            return "";
        }

    }
    catch (err) {
        console.log("Error occured" + err);
    }
}
function showAlert(pData) {
    try {
        //$('#modal-Loader').modal('hide');
        var isCancelButtonClicked = false;
        $('#alert-modal .modal-content').removeClass('alert-success');
        $('#alert-modal .modal-content').removeClass('alert-danger');
        $('#alert-modal .modal-content').removeClass('alert-warning');
        $('#alert-modal .modal-content').removeClass('alert-info');
        $('#btnDialogYes').hide();
        $('#btnDialogNo').html('<i class="fa fa-close"></i> Close');
        $('#alert-modal .modal-title').html(pData.title);
        $('#alert-modal .modal-body').html('<p style="font-size:16px">' + pData.message + '</p>');

        if (pData.type == 'SUCCESS') {
            $('#alert-modal .modal-content').addClass('alert-success');
        }
        else if (pData.type == 'ERROR') {
            $('#alert-modal .modal-content').addClass('alert-danger');
        }
        else if (pData.type == 'WARNING') {
            $('#alert-modal .modal-content').addClass('alert-warning');
        }
        else if (pData.type == 'INFO') {
            $('#alert-modal .modal-content').addClass('alert-info');
        }
        else if (pData.type == 'CONFIRM') {
            $('#alert-modal .modal-content').addClass('alert-warning');
            $('#btnDialogYes').html('<i class="fa fa-close"></i> No');
            $('#btnDialogNo').show();
        }
        
        $('#alert-modal').modal({
            backdrop: true,
            keyboard: true
           
        });
    }
    catch (err) {
        alert(err);
    }
}
function showAlert_OLD(pData) {
    try {
        var isCancelButtonClicked = false;
        $('#alert-modal').removeClass('modal-success');
        $('#alert-modal').removeClass('modal-danger');
        $('#alert-modal').removeClass('modal-warning');
        $('#alert-modal').removeClass('modal-info');
        $('#btnDialogYes').hide();
        $('#btnDialogNo').html('<i class="fa fa-close"></i> Close');
        $('#alert-modal .modal-title').html(pData.title);
        $('#alert-modal .modal-body').html('<p style="font-size:16px">' + pData.message + '</p>');
        if (pData.type == 'SUCCESS') {
            $('#alert-modal').addClass('modal-success');
        }
        else if (pData.type == 'ERROR') {
            $('#alert-modal').addClass('bg-danger');
        }
        else if (pData.type == 'WARNING') {
            $('#alert-modal').addClass('modal-warning');
        }
        else  if (pData.type == 'INFO') {
            $('#alert-modal').addClass('modal-info');
        }
        else if (pData.type == 'CONFIRM') {
            $('#alert-modal').addClass('modal-warning');
            $('#btnDialogYes').html('<i class="fa fa-close"></i> No');
            $('#btnDialogNo').show();
        }
        $('#btnDialogYes').unbind('click');
        $('#btnDialogNo').unbind('click');
        if (pData.action) {
            $("#btnDialogYes").bind('click', function () {
                $('.modal-backdrop').remove();
                pData.action();
            });
        }
        if (pData.cancel) {
            $("#btnDialogNo").bind('click', function () {
                $('.modal-backdrop').remove();
                isCancelButtonClicked = true;
                pData.cancel();
            });
        }
        $('#alert-modal').on('hidden.bs.modal', function () {
            $('.modal-backdrop').remove();
            if (pData.cancel && isCancelButtonClicked == false) {
                isCancelButtonClicked = false;
                pData.cancel();
            }
        });
        $('#alert-modal').modal({
            backdrop: true,
            keyboard: true
        });
    }
    catch (err) {
        alert(err);
    }
}

function bindDropDownList(ddl,type,url,dataType,value,name) {
    try {
        var ddlName = $("#" + ddl);
        ddlName.empty().append('<option selected="selected" value="0" disabled = "disabled">Loading...</option>');
        $.ajax({
            type: type,
            url: url,
            contentType: "application/json; charset=utf-8",
            dataType: dataType,
            success: function (response) {
                ddlName.empty().append('<option selected="selected" value="0">Select</option>');
                $.each(response, function () {
                    ddlName.append($("<option></option>").val(this[''+value+'']).html(this[''+name+'']));
                });
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