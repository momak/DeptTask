$(document).ready(function () {

        $('#tblCity').DataTable({
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
                "url": 'https://api.openaq.org/v1/cities?order_by[]=country&order_by[]=city',
            "dataSrc": "results"
        },
        "columns": [
            { data: "city" },
            {
                data: "country",
                "render": function (data, type, row, meta) {
                    return type === 'display'
                        ? '<a href="https://api.openaq.org/v1/cities?country=' + data + '">' + data + '</span>'
                        : data;
                }
            },
            { data: "count" },
            { data: "locations" }
        ]
        //https://api.openaq.org/v1/measurements?location=MK0048A&parameter[]=pm10&parameter[]=pm25&order_by=date&sort=desc&limit=10000

    });

    $.ajax({
        url: "https://api.openaq.org/v1/countries?order_by=name",
        dataType: 'json',
        type: 'GET',
        success: function (response) {
            $('#ddlCountry').empty();
            $('#ddlCountry').append("<option selected value='' >---Choose Country---</option>");
            $.each(response.results, function (i, item) {
                $('#ddlCountry').append($('<option></option>').val(item.code).html(item.name));
            });
        },
        error: function (response) {
            toastr["error"](JSON.parse(response.responseText).message);
            console.log(response);
        },
        beforeSend: function () {
            showProgress();
        },
        complete: function () {
            hideProgress();
        }
    });

    $('#ddlCountry').on('change',
        function () {
            var url = 'https://api.openaq.org/v1/cities?';
            if (this.value !== "")
                url += 'country=' + this.value + '&';

            url += 'page=' + $('#page').val() + '&';
            url += 'limit=' + $('#limit').val() + '&';

            url += 'order_by[]=locations&order_by[]=city';

            $('#tblCity').DataTable({
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
                    "url": url,
                    "dataSrc": "results"
                },
                "columns": [
                    { data: "city" },
                    {
                        data: "country",
                        "render": function (data, type, row, meta) {
                            return type === 'display'
                                ? '<a href="https://api.openaq.org/v1/cities?country=' + data + '">' + data + '</span>'
                                : data;
                        }
                    },
                    { data: "count" },
                    { data: "locations" }
                ]
                //https://api.openaq.org/v1/measurements?location=MK0048A&parameter[]=pm10&parameter[]=pm25&order_by=date&sort=desc&limit=10000

            });
        });
});