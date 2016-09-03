$(document).ready(function() {

    $('body').videoBG({
        position: "fixed",
        zIndex: 0,
        mp4: '/snow.mp4',
        webm: '/snow.mp4',
        opacity: 1.0,
        fullscreen: true,
    });

    $('#navigation').load('/components/navbar.html');
    $('#footer').load('/components/footer.html');
})