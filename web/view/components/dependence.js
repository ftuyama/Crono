var htmlImportSupported = 'import' in document.createElement('link');

if (!htmlImportSupported) {
    /* Webcomponents substitui import HTML */
    var script = document.createElement('script');
    script.async = true;
    script.src = '/public/html/webcomponents-lite.min.js';
    document.head.appendChild(script);


    var script = document.createElement('script');
    script.async = true;
    script.src = '/public/js/jquery-2.1.4.min.js';
    document.head.appendChild(script);


    var script = document.createElement('script');
    script.async = true;
    script.src = '/public/js/angular.min.js';
    document.head.appendChild(script);



    /* Imports HTML carregados com sucesso */
    window.addEventListener('HTMLImportsLoaded', function(e) {
        $('#navbar').load('/components/navbar.html');
        $('#footer').load('/components/footer.html');
    });
}