$(document).ready(function () {
    $('#city').hide();
    $('#table').hide();
    $('#locations').hide();
    
    var urlService = $('#urlService').val();
    var urlLocal = $('#urlLocal').val();

    $("#btnGet").click(function (e) {
        e.preventDefault();

        var urlPath = urlLocal + "?urlRequest=measurements?";

        if ($('#ddlCountry').val() !== "")
            urlPath += "country=" + $('#ddlCountry').val();

        if (($('#ddlCity').val() !== "") && ($('#ddlCity').val() !== null))
            urlPath += "%26city=" + $('#ddlCity').val();

        if (($('#ddlLocations').val() !== "") && ($('#ddlLocations').val() !== null))
            urlPath += "%26location=" + $('#ddlLocations').val();



        if ($('#ddlParameters').val() !== "")
            urlPath += "%26parameter[]=" + $('#ddlParameters').val();

        if ($('#dateStart').val() !== "")
            urlPath += "%26date_from=" + $('#dateStart').val();

        if ($('#dateEnd').val() !== "")
            urlPath += "%26date_to=" + $('#dateEnd').val();



        if ($('#page').val() !== "")
            urlPath += "%26page=" + $('#page').val();

        if ($('#limit').val() !== "")
            urlPath += "%26limit=" + $('#limit').val();

        if ($('#ddlOrder').val() !== "")
            urlPath += "%26order_by=" + $('#ddlOrder').val();

        if ($('#ddlDirection').val() !== "")
            urlPath += "%26sort=" + $('#ddlDirection').val();


        $('#tblData').DataTable({
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
                { data: "parameter" },
                { data: "country" },
                { data: "city" },
                { data: "location" },
                { data: "value" },
                { data: "unit" },
                {
                    data: "date.local",
                    "render": function (data, type, row, meta) {
                        return formatDate(data);
                    }
                }
            ]
        });
        $('#table').show();
    });



    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-full-width",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };


    $.ajax({
        url: urlLocal + "?urlRequest=countries?order_by=name",
        dataType: 'json',
        type: 'GET',
        success: function (response) {
            $('#ddlCountry').empty();
            $('#ddlCountry').append("<option selected value='' >---All Countries---</option>");
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
    $.ajax({
        url: urlLocal + "?urlRequest=parameters",
        dataType: 'json',
        type: 'GET',
        success: function (response) {
            $('#ddlParameters').empty();
            $('#ddlParameters').append("<option selected value='' >---All Parameters---</option>");
            $.each(response.results, function (i, item) {
                $('#ddlParameters').append($("<option></option>").val(item.id).html(item.name));
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
            $.ajax({
                url: urlLocal + "?urlRequest=cities?country=" + this.value + "%26order_by[]=locations%26order_by[]=city",
                dataType: 'json',
                type: 'GET',
                success: function (response) {
                    $('#ddlCity').empty();
                    $("#ddlCity").append("<option selected value='' >---All Cities---</option>");
                    $.each(response.results, function (i, item) {
                        $('#ddlCity').append($("<option></option>").val(item.city).html(item.city + ' (' + item.locations + ')'));
                    });
                    $('#city').show();
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
        });
    $('#ddlCity').on('change',
        function () {
            $.ajax({
                url: urlLocal + "?urlRequest=locations?city=" + this.value,
                dataType: 'json',
                type: 'GET',
                success: function (response) {
                    $('#ddlLocations').empty();
                    $("#ddlLocations").append("<option selected value='' >---All Locations---</option>");
                    $.each(response.results,
                        function (i, arr) {
                            $('#ddlLocations').append($("<option></option>").val(arr.location).html(arr.location));
                        });

                    $('#locations').show();
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
        });

});

function formatDate(date) {
    var d = new Date(date);

    var hours = d.getHours();
    var minutes = d.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear() + "  " + strTime;
}