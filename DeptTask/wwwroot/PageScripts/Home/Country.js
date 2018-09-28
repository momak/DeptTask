$(document).ready(function () {
    $('#tblCountry').DataTable({
        "processing": true,
        "searching": true,
        "searchDelay": 1000,
        "stateSave": false,
        "deferRender": true,
        "info": true,
        "filter": true,
        "orderMulti": true,
        "ajax": {
            "url": "https://api.openaq.org/v1/countries",
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
        //https://api.openaq.org/v1/measurements?location=MK0048A&parameter[]=pm10&parameter[]=pm25&order_by=date&sort=desc&limit=10000
       
    });
});