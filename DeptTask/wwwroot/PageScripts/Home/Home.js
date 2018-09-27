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

    toastr["warning"]("My name is Inigo Montoya. You killed my father. Prepare to die!");
    toastr.info('Are you the 6 fingered man?');

    hideProgress();
    $.ajax({
        url: "https://api.openaq.org/v1/countries",
        dataType: 'json',
        type: 'GET',
        success: function (response) {
            debugger 
            toastr.info(response);
        },
        error: function (response) {
            toastr["error"](JSON.parse(response.responseText).message);
            console.log(response);
            return false;
        },
        beforeSend: function () {
            showProgress();
        },
        complete: function () {
            hideProgress();
        }
    });
});