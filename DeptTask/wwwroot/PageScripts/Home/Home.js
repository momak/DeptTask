$(document).ready(function () {
    $('#city').hide();
    $('#table').hide();
    $('#locations').hide();

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
        url: "https://api.openaq.org/v1/countries",
        dataType: 'json',
        type: 'GET',
        success: function (response) {
            $('#ddlCountry').empty();
            $('#ddlCountry').append($('<option>').text('--Choose Country--').attr('value'));
            $.each(response.results, function (i, item) {
                $('#ddlCountry').append($('<option>').text(item.name).attr('value', item.code));
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
                url: "https://api.openaq.org/v1/cities?country=" + this.value,
                dataType: 'json',
                type: 'GET',
                success: function (response) {
                    $('#ddlCity').empty();
                    $("#ddlCity").append("<option selected value='' >---Choose City---</option>");
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
                url: "https://api.openaq.org/v1/locations?city=" + this.value,
                dataType: 'json',
                type: 'GET',
                success: function (response) {
                    $('#ddlLocations').empty();
                    $("#ddlLocations").append("<option selected value='' >---Choose Location---</option>");
                    $.each(response.results,
                        function (i, arr) {
                            //$.each(i, response.results[i],
                                //function (i, item) {
                                    $('#ddlLocations').append($("<option></option>").val(arr.location).html(arr.location));
                                //});
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