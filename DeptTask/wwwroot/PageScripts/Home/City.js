$(document).ready(function () {

    var urlService = $('#urlService').val();
    var urlLocal = "/" + $('#urlLocal').val();

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
            "url": urlLocal + '?urlRequest=cities?order_by[]=country%26order_by[]=city',
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
    });

    $.ajax({
        url: urlLocal + "?urlRequest=countries?order_by=name",
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
            var url = urlLocal + "?urlRequest=cities?";

            if (this.value !== "")
                url += 'country=' + this.value + '%26';

            url += 'page=' + $('#page').val() + '%26';
            url += 'limit=' + $('#limit').val() + '%26';

            url += 'order_by[]=locations%26order_by[]=city';

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
            });
        });

    $("#btnShow").click(function (e) {
        e.preventDefault();
        debugger
        var urlPath = urlLocal + "?urlRequest=cities?";

        if ($('#ddlCountry').val() !== "")
            urlPath += "country=" + $('#ddlCountry').val();

        if ($('#limit').val() !== "")
            urlPath += "%26limit=" + $('#limit').val();

        if ($('#page').val() !== "")
            urlPath += "%26page=" + $('#page').val();

        urlPath += '%26order_by[]=locations%26order_by[]=city';

        $('#tblCity').DataTable({
            "processing": true,
            "destroy": true,
            "searching": true,
            "searchDelay": 1000,
            "stateSave": false,
            "deferRender": true,
            "info": true,
            "filter": true,
            "orderMulti": false,
            "ajax": {
                "url": urlPath,
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
        });
        $('#table').show();
    });
});