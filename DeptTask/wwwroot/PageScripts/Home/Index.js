$(document).ready(function () {
    $('#city').hide();
    $('#table').hide();
    $('#locations').hide();
    var d = new Date();
    $('#dateStart').value = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();

    $("#btnGet").click(function (e) {
        e.preventDefault();

        var urlCall = "api/DeptTask/Log?urlRequest=measurements?"; //"https://api.openaq.org/v1/measurements?";

        if ($('#ddlCountry').val() !== "")
            urlCall += "country=" + $('#ddlCountry').val();

        if (($('#ddlCity').val() !== "") && ($('#ddlCity').val() !== null))
            urlCall += "%26city=" + $('#ddlCity').val();

        if (($('#ddlLocations').val() !== "") && ($('#ddlLocations').val() !== null))
            urlCall += "%26location=" + $('#ddlLocations').val();

        if ($('#ddlParameters').val() !== "")
            urlCall += "%26parameter[]=" + $('#ddlParameters').val();

        if ($('#dateStart').val() !== "")
            urlCall += "%26date_from=" + $('#dateStart').val();

        if ($('#dateEnd').val() !== "")
            urlCall += "%26date_to=" + $('#dateEnd').val();

        urlCall += "%26order_by=date%26sort=desc%26limit=10000";


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
                "url": urlCall,
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
        url: "api/DeptTask/Log?urlRequest=countries?order_by=name",
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
    $.ajax({
        url: "api/DeptTask/Log?urlRequest=parameters",
        dataType: 'json',
        type: 'GET',
        success: function (response) {
            $('#ddlParameters').empty();
            $('#ddlParameters').append("<option selected value='' >---Choose Parameters---</option>");
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
                url: "api/DeptTask/Log?urlRequest=cities?country=" + this.value + "&order_by[]=locations&order_by[]=city",
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
                url: "api/DeptTask/Log?urlRequest=locations?city=" + this.value,
                dataType: 'json',
                type: 'GET',
                success: function (response) {
                    $('#ddlLocations').empty();
                    $("#ddlLocations").append("<option selected value='' >---Choose Location---</option>");
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