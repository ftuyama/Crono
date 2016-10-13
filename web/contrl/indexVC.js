/*
===========================================================================
                Index View Controller using Angular
===========================================================================
*/
var indexApp = angular.module("indexApp", ['ngCookies']);

indexApp.controller("indexVC", function($scope, $http, $cookies, $compile) {

    $scope.commits = [];
    $scope.languages = {}
    $scope.tags = ["calendar", "angularjs", "css3", "nodejs", "github", "google", "firebase"];
    $scope.links = { "Home": "/", "Calendar": "/calendar", "Contact": "https://github.com/ftuyama/Crono", "About": "/about" };

    /* Fetching Crono languages */
    $.getJSON("https://api.github.com/repos/ftuyama/Crono/languages", function(data) {
        total = $
            .map(data, function(v) { return v; })
            .reduce(function(a, b) { return a + b; }, 0);
        percents = $.map(data, function(v) { return 100 * v / total; });
        var index = 0;
        for (var key in data)
            data[key] = percents[index++];
        $scope.languages = data;
        $scope.$apply();
    });

    /* Fetching last commits */
    $.getJSON("https://api.github.com/repos/ftuyama/Crono/commits", function(data) {
        $scope.commits = data.filter(mergeOff).slice(0, 5);
        $scope.$apply();
    });

    /* Fetching IP and Address */
    $.get("http://ipinfo.io", function(response) {
        $("#coffee").attr("href",
            "https://www.google.com.br/maps/search/café/@" +
            response.loc + ",14z"
        );
        $("#ip").append(
            '<p style="color:#e74c3c;">IP: ' + response.ip + '</p>' +
            '<p style="color:#e74c3c;">Location: ' + response.city +
            ', ' + response.region + '</p>'
        );
    }, "jsonp");

    function mergeOff(commit) {
        return (commit.commit.message.indexOf("Merged") == -1);
    }
});

$(".bxslider").bxSlider({
        auto: !0,
        preloadImages: "all",
        mode: "horizontal",
        captions: !1,
        controls: !0,
        pause: 8000,
        speed: 600,
        onSliderLoad: function() {
            $(".bxslider>li .slide-inner").eq(1).addClass("active-slide"), $(".slide-inner.active-slide .slider-title").addClass("wow animated bounceInDown"), $(".slide-inner.active-slide .slide-description").addClass("wow animated bounceInRight"), $(".slide-inner.active-slide .btn").addClass("wow animated zoomInUp")
        },
        onSlideAfter: function(e, i, n) {
            console.log(n), $(".active-slide").removeClass("active-slide"), $(".bxslider>li .slide-inner").eq(n + 1).addClass("active-slide"), $(".slide-inner.active-slide").addClass("wow animated bounceInRight")
        },
        onSlideBefore: function() {
            $(".slide-inner.active-slide").removeClass("wow animated bounceInRight"), $(".one.slide-inner.active-slide").removeAttr("style")
        }
    }), $(document).ready(function() {
        function e() {
            return "ontouchstart" in document.documentElement
        }

        function i() {
            if ("undefined" != typeof google) {
                var i = {
                    center: [-23.21, -45.85],
                    zoom: 14,
                    mapTypeControl: !0,
                    mapTypeControlOptions: {
                        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                    },
                    navigationControl: !0,
                    scrollwheel: !1,
                    streetViewControl: !0
                };
                e() && (i.draggable = !1), $("#googleMaps").gmap3({
                    map: {
                        options: i
                    },
                    marker: {
                        latLng: [-23.2108, -45.8751],
                        options: {
                            icon: "public/img/mapicon.png"
                        }
                    }
                })
            }
        }
        $("#masthead #main-menu").onePageNav(), i()
    }),
    /*
     * Mailer Service
     */
    $("#contactform").on("submit", function(e) {
        $("#submit").attr("disabled", "disabled");
        e.preventDefault(), $this = $(this), $.ajax({
            type: "POST",
            url: $this.attr("action"),
            data: $this.serialize(),
            success: function() {
                alert("Message Sent Successfully")
            },
            fail: function() {
                alert("Sorry, something went wrong");
            }
        })
    });

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