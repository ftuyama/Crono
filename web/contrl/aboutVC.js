// Finaliza Loader em 3 segundos
$(document).ready(function() {
    setTimeout(function() {
        $('body').addClass('loaded');
    }, 3000);
});

/*
 * Facebook
 */

/*
 * Facebook
 */

window.fbAsyncInit = function() {
    FB.init({
        appId: '1321278234570954',
        xfbml: true,
        version: 'v2.8'
    });
    // Facebook Analytics
    FB.AppEvents.logEvent("about");
};

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

/*
 * Google Analytics
 */
(function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', '/js/analytics.js', 'ga');

ga('create', 'UA-60506552-2', 'auto');
ga('send', 'pageview');