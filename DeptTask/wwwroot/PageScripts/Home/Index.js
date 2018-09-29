$(document).ready(function () {
    $('#city').hide();
    $('#table').hide();
    $('#locations').hide();
    var d = new Date();
    $('#dateStart').value = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();

    $('#tblData').DataTable({
        "processing": true,
        //"serverSide": true, // for process server side
        "searching": false,
        "searchDelay": 1000,
        "stateSave": false,
        "deferRender": true,
        "info": true,
        "filter": false,
        "orderMulti": false,
        //https://api.openaq.org/v1/measurements?location=MK0048A&parameter[]=pm10&parameter[]=pm25&order_by=date&sort=desc&limit=10000
        //"columns": [
        //    { "data": "GlobalItemId", "name": "GlobalItemId", "autoWidth": true },
        //    { "data": "GlobalItemName", "name": "GlobalItemName", "autoWidth": true },
        //    { "data": "ConfigId", "name": "ConfigId", "autoWidth": true },
        //    { "data": "CompanyItemId", "name": "CompanyItemId", "autoWidth": true },
        //    { "data": "CompanyItemName", "name": "CompanyItemName", "autoWidth": true }
        //]
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