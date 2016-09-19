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
                        icon: "assets/images/mapicon.png"
                    }
                }
            })
        }
    }
    $("#masthead #main-menu").onePageNav(), i()
}), $("#contactform").on("submit", function(e) {
    e.preventDefault(), $this = $(this), $.ajax({
        type: "POST",
        url: $this.attr("action"),
        data: $this.serialize(),
        success: function() {
            alert("Message Sent Successfully")
        }
    })
});


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
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-63948535-1', 'auto');
ga('send', 'pageview');