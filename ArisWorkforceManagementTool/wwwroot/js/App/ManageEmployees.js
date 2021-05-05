var glbEmpFilePath;
var table_passport;
var table_resident;
var table_remaining;

$(document).ready(function () {

    GetAllUploads("PASSPORT");  
    GetAllUploads("RESIDENT");
    GetAllUploads("REMAINING");

   
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
function uploadDocuments(inputId) {
    var docId = inputId.split("_")[1];
    var input = document.getElementById(inputId);
    var files = input.files;
    var formData = new FormData();
    var empNo = $("#txtEmployeeNumber").val().trim();
    for (var i = 0; i != files.length; i++) {
        formData.append("files", files[i]);
    }
    formData.append("empNo", empNo);
    formData.append("docId", parseInt(docId));


    $.ajax(
        {
            url: "/MasterPages/ManageEmployees/UploadDocuments",
            data: formData,
            processData: false,
            contentType: false,
            type: "POST",
            async: false,
            success: function (data) {
                GetAllUploads("PASSPORT");  // testing is in progress
                GetAllUploads("RESIDENT");
                GetAllUploads("REMAINING");
            }
        }
    );
}

function GetAllUploads(uType) {

    $.ajax({
        type: "GET",
        url: "/MasterPages/ManageEmployees/GetAllUploads",
        contentType: "application/json; charset=utf-8",
        data: { uploadType: uType },
        dataType: "json",
        success: function (response) {
            if (response != null) {
                if (uType == 'PASSPORT') {
                    populatePassport(response);
                }
                else if (uType == 'RESIDENT') {
                    populateResident(response);
                }
                else {
                    populateRemaining(response);
                }

            } else {
                // alert("Something went wrong");
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
function populatePassport(response) {
    console.log(response);
    var docId = 0;
    table_passport = $("#tblPassportFiles").DataTable(
        {
            bLengthChange: false,
            bFilter: true,
            bSort: true,
            bPaginate: true,
            data: response,
            scrollY: "650px",
            sScrollX: "100%",
            scrollCollapse: true,
            select: true,
            pageLength: 10,
            destroy: true,
            columns: [
                {
                    data: 'documentId', title: 'Document ID', visible: false,
                    render: function (data) {
                        if (data != null) { docId = data; }
                        return data;
                    }

                },
                {
                    data: 'documentName', title: 'Document Name',
                },
                {
                    data: 'fileName', title: 'File Name',
                    class:'download',
                    render: function (data) {
                        if (data == "No Files") {
                            return data;
                        }
                        else {
                            return '<a href="#" id="download_' + docId + '">' + data + '</a>';
                        }
                    }
                },
                {
                    data: null,
                    title: 'Upload',
                    class: 'upload',
                    render: function (data) {
                        return '<input type="file" id="upload_' + docId + '" onchange="uploadDocuments(\'upload_' + docId + '\');">';
                    }
                }
            ]
        });

}
function populateResident(response) {
    var docId = 0;
    table_passport = $("#tblResidentFiles").DataTable(
        {
            bLengthChange: false,
            bFilter: true,
            bSort: true,
            bPaginate: true,
            data: response,
            scrollY: "650px",
            sScrollX: "100%",
            scrollCollapse: true,
            select: true,
            pageLength: 10,
            destroy: true,
            columns: [
                {
                    data: 'documentId', title: 'Document ID', visible: false,
                    render: function (data) {
                        if (data != null) { docId = data; }
                        return data;
                    }

                },
                {
                    data: 'documentName', title: 'Document Name',
                },
                {
                    data: 'fileName', title: 'File Name',
                    render: function (data) {
                        if (data == "No Files") {
                            return data;
                        }
                        else {
                            return '<a href="test" id="download_' + docId + '">' + data + '</a>';
                        }
                    }
                },
                {
                    data: null,
                    title: 'Upload',
                    class: 'upload',
                    render: function (data) {
                        return '<input type="file" id="upload_' + docId + '" onchange="uploadDocuments(\'upload_' + docId + '\');">';
                    }
                }
            ]
        });

}
function populateRemaining(response) {
    var docId = 0;
    table_remaining = $("#tblRemainingFiles").DataTable(
        {
            bLengthChange: false,
            bFilter: false,
            bSort: false,
            bPaginate: false,
            data: response,
            scrollY: "650px",
            sScrollX: "100%",
            scrollCollapse: true,
            select: true,
            pageLength: 10,
            destroy: true,
            columns: [
                {
                    data: 'documentId', title: 'Document ID', visible: false,
                    render: function (data) {
                        if (data != null) { docId = data; }
                        return data;
                    }

                },
                {
                    data: 'documentName', title: 'Document Name',
                },
                {
                    data: 'fileName', title: 'File Name',
                    render: function (data) {
                        if (data == "No Files") {
                            return data;
                        }
                        else {
                            return '<a href="test" id="download_' + docId + '">' + data + '</a>';
                        }
                    }
                },
                {
                    data: null,
                    title: 'Upload',
                    class: 'upload',
                    render: function (data) {
                        return '<input type="file" id="upload_' + docId + '" onchange="uploadDocuments(\'upload_' + docId + '\');">';
                    }
                }
            ]
        });

}
///code to remove unwanted files from table
function deleteInvalidUploads() {
    var userId = 1; //need to automate it
    var empNo = $("#txtEmployeeNumber").val().trim();
    $.ajax({
        type: "GET",
        url: "/MasterPages/ManageEmployees/DeleteInValidUploads",
        contentType: "application/json; charset=utf-8",
        data: { empNo: empNo, userId:userId },
        dataType: "json",
        success: function (response) {
            if (response != null) {

                 GetAllUploads("PASSPORT");  
                 GetAllUploads("RESIDENT");
                 GetAllUploads("REMAINING");


            } else {
                // alert("Something went wrong");
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
//download function for passport files
$('#tblPassportFiles').on('click', 'td.download', function (e) {
    e.preventDefault();
    try {
       // window.location.href = "../Uploads/EmployeeUploads/ARIS-3/132647177523759410_5. ColorPhoto.jpeg";
        var filePath = "../Uploads/EmployeeUploads/ARIS-3/132647177523759410_5. ColorPhoto.jpeg";
        var link = document.createElement('a');
        link.href = filePath;
        link.download = filePath.substr(filePath.lastIndexOf('/') + 1);
        link.click();
    }
    catch (err) {
        console.log(err);
    }
});

