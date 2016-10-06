// Finaliza Loader em 3 segundos
$(document).ready(function() {
    setTimeout(function() {
        $('body').addClass('loaded');
    }, 3000);
});