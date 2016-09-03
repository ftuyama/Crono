/* Verifica os dados recebidos */
function loadHTML(data) {
    if (data == null)
        return;
    generateTable(data);
}

/* Gera a lista de usuários no HTML */
function generateTable(data) {
    var out = "<table>";
    for (var prop in data) {
        out += "<tr><td>" +
        data[prop].name +
        "</td><td>" +
        data[prop].pass +
        "</td></tr>";
    }
    out += "</table>";
    document.getElementById("resposta").innerHTML = out;
}