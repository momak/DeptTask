$(document).ready(function () {
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
    $('#ddlCity').hide();
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
        function() {
            $.ajax({
                url: "https://api.openaq.org/v1/cities?country="+this.value,
                dataType: 'json',
                type: 'GET',
                success: function (response) {
                    $('#ddlCity').empty();
                    $('#ddlCity').append($('<option>').text('--Choose City--').attr('value'));
                    $.each(response.results, function (i, item) {
                        $('#ddlCity').append($('<option>').text(item.city + ' (' + item.locations +')').attr('value', item.code));
                    });
                    $('#ddlCity').show();
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