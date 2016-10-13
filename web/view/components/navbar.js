/*
 *   Carrega os links da navbar e determina sua cor
 */
$(document).ready(function() {
    $.getJSON("/data/navigation.json", function(data) {
        data.forEach(function(nav) {
            var item = '<li><a href="' + nav.url +
                '" onclick="' + nav.event + '">' +
                '<i class="' + nav.icon + '"></i> ' +
                nav.name + '</a></li>';
            $("#navlinks").append(item);
        });
    });

    if (isNotSafari()) {
        $.get("/calendarAuth/img", function(data) {
            if (data != undefined && data != "undefined" && data != "null" && data != "")
                $('#profile').append('<img id="userImg" src="' + decodeURIComponent(data) + '"/>');
        });
    }
});