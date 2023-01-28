//Mostrar a data de hoje
let mostrarDia = document.getElementById("dia")
function refreshDia() {
    let timeElapsed = Date.now();
    let dateString = new Date(timeElapsed);
    let formattedString = dateString.toLocaleDateString();
    mostrarDia.innerHTML = formattedString;
}
setInterval(refreshDia, 0)

//Mostrar o horário no momento
let timeDisplay = document.getElementById("time")
function refreshTime() {
    let timeElapsed = Date.now();
    let dateString = new Date(timeElapsed).toLocaleTimeString();
    let formattedString = dateString;
    timeDisplay.innerHTML = formattedString;
}
setInterval(refreshTime, 0)