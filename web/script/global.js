/*
    ===========================================================================
                        Global functions to manage Cookies
    ===========================================================================
*/

/* Função para leitura dos cookies */
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

/* Função para escrita dos cookies */
function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

/*
    ===========================================================================
                        Global functions to manage Colors
    ===========================================================================
*/

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return LightenDarkenColor(color, 40);
}

function LightenDarkenColor(col, amt) {
    var usePound = false;
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col, 16);

    var r = (num >> 16) + amt;
    r = colorInRange(r);

    var b = ((num >> 8) & 0x00FF) + amt;
    b = colorInRange(b);

    var g = (num & 0x0000FF) + amt;
    g = colorInRange(g);

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}

function colorInRange(col) {
    if (col > 255) return 255;
    else if (col < 0) return 0;
    return col;
}

function djb2(str) {
    var hash = 5381;
    for (var i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
    }
    return hash;
}

var stringToColour = function(str) {
    var hash = djb2(str);
    var r = (hash & 0xFF0000) >> 16;
    var g = (hash & 0x00FF00) >> 8;
    var b = hash & 0x0000FF;
    return "#" +
        ("0" + r.toString(16)).substr(-2) +
        ("0" + g.toString(16)).substr(-2) +
        ("0" + b.toString(16)).substr(-2);

}

/*
    ===========================================================================
                        Global functions to manage Dates
    ===========================================================================
*/

/* Compare the current date against another date.
 *
 * @param b  {Date} the other date
 * @returns   -1 : if this < b
 *             0 : if this === b
 *             1 : if this > b
 *            NaN : if a or b is an illegal date
 */
Date.prototype.compare = function(b) {
    if (b.constructor !== Date) {
        throw "invalid_date";
    }

    return (isFinite(this.valueOf()) && isFinite(b.valueOf()) ?
        (this > b) - (this < b) : NaN
    );
};

Date.prototype.sameDay = function(d) {
    return this.getFullYear() === d.getFullYear() &&
        this.getDate() === d.getDate() &&
        this.getMonth() === d.getMonth();
}

Date.prototype.sameMonthYear = function(d) {
    return this.getFullYear() === d.getFullYear() &&
        this.getMonth() === d.getMonth();
}

Date.prototype.sameWeekYear = function(d, w) {
    return this.getFullYear() === d.getFullYear() &&
        this.getWeek() === w;
}

Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}

var userLang = navigator.language || navigator.userLanguage;

/* Generating Months' names list */
var monthNames = [];
if (isNotSafari()) {
    for (i = 1; i <= 12; i++) {
        var month = ("0" + i).slice(-2);
        var date = new Date(month + "/1/2009");
        var monthName = date.toLocaleString(userLang, { month: "long" });
        monthNames.push(capitalizeFirstLetter(monthName));
    }
} else monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

/* Generating Days' names list */
var daysNames = [];
if (isNotSafari()) {
    for (i = 1; i <= 7; i++) {
        var date = new Date("05/0" + i + "/2016");
        var dayName = date.toLocaleString(userLang, { weekday: "long" });
        daysNames.push(capitalizeFirstLetter(dayName));
    }
} else daysNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function returnMonth(month) {
    return monthNames.indexOf(month.trim());
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/*
    ===========================================================================
                        Global generic purpose functions
    ===========================================================================
*/

function isNotSafari() {
    return !navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
}

function showSnackBar(message) {
    var x = document.getElementById("snackbar");
    x.innerHTML = message;
    x.className = "show";
    setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);
}

function isFunction(v) {
    return typeof v === "function";
}

function cleanGroup(group) {
    return group.replace(/\.|\#|\$|\[|\]|\@/g, "");
}

function removePath(path) {
    return path.split('\\').pop();
}
/*
    ===========================================================================
                        Exporta funções para testes unitários
    ===========================================================================
*/
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = {
        _colorInRange: colorInRange
    };