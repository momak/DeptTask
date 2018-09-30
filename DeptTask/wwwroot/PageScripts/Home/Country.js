$(document).ready(function () {
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
            "dataSrc": "results"
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
});