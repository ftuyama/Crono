/* Carrega o tema salvo em cookie */
loadTheme(readCookie("theme"));

/* Carrega o tema para as páginas */
function loadTheme(theme) {
    if (theme == undefined || theme == 'undefined' || theme == 'light') {
        createCookie("theme", "light", 365);
        $('link[href="/dark-default.css"]').attr('href', '/light-default.css');
        $('link[href="/dark-calendar.css"]').attr('href', '/light-calendar.css');
    } else {
        createCookie("theme", "dark", 365);
        $('link[href="/light-default.css"]').attr('href', '/dark-default.css');
        $('link[href="/light-calendar.css"]').attr('href', '/dark-calendar.css');
    }
}

/* Inverte o tema aplicado ao site */
function changeTheme() {
    if (readCookie("theme").localeCompare('light') == 0)
        loadTheme('dark');
    else loadTheme('light');
}