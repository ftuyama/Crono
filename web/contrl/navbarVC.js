/*
 *   Carrega os links da navbar e determina sua cor
 */
$(document).ready(function() {
    var userLang = navigator.language || navigator.userLanguage;

    $.getJSON("/data/navigation.json", function(data) {
        data.forEach(function(nav) {
            var item = '<li><a href="' + nav.url +
                '" onclick="' + nav.event + '">' +
                '<i class="' + nav.icon + '"></i> ' +
                nav.name[userLang] + '</a></li>';
            $("#navlinks").append(item);
        });
    });

    if (isNotSafari())
        $.get("/calendarAuth/img", function(data) {
            if (data != undefined && data != "undefined" && data != "null" && data != "")
                $('#profile').append('<img id="userImg" src="' + decodeURIComponent(data) + '"/>');
        });
    $.get("/calendarAuth/user", function(user) {
        if (user != undefined && user != "undefined" && user != "null" && user != "")
            $('#crono_username').text(user.displayName);
    });
});