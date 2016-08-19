function funcao() {
    document.getElementById("title").innerHTML = "Hello Society!";

    // Exibindo contador de visitas
    var counter = document.getElementById("counter");
    counter.hidden = false;
    counter.innerHTML = "Visita Nº " + contador;
}
function zero() {
    contador = readCookie("number");
}
function readCookie(name) {
    var cookieP = document.getElementById("cooki");
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
    cookieP.innerHTML = "<br>Cookies: " + document.cookie;
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return 0;
}