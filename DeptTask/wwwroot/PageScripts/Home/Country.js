﻿$(document).ready(function () {
    var urlService = $('#urlService').val();
    var urlLocal = "/"+$('#urlLocal').val();

    $('#tblCountry').DataTable({
        "processing": true,
        "destroy": true,
        "searching": true,
        "searchDelay": 1000,
        "stateSave": false,
        "deferRender": true,
        "info": true,
        "filter": true,
        "orderMulti": true,
        "ajax": {
            "url": urlLocal +"?urlRequest=countries",
            "dataSrc": "results",
            "error": function (xhr, status, error) {
                toastr["error"](xhr.responseText);
                console.log(xhr.responseText);
                $("#tblCountry_processing").css("visibility", "hidden");
                return true;
            }
        },
        "columns": [
            { data: "name" },
            {
                data: "code",
                "render": function (data, type, row, meta) {
                    return type === 'display'
                        ? '<a href="https://api.openaq.org/v1/cities?country=' + data + '">' + data + '</span>'
                        : data;
                }
            },
            { data: "cities" },
            { data: "locations" },
            { data: "count" }
        ]
    });

    $("#btnCountries").click(function (e) {

        $.ajax({
            url: "/Home/StoreCountries",
            dataType: 'json',
            type: 'POST',
            success: function (response) {
                if (response) {
                    toastr["success"]("Data Successfully synchronized");
                    console.log(response);
                }
            },
            error: function (response) {
                toastr["error"](response.responseText);
                console.log(response);
            },
            beforeSend: function () {
                showProgress();
            },
            complete: function () {
                hideProgress();
            }
        });

        e.preventDefault();
    });
});