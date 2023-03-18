//Mostrar a data de hoje
const mostrarDia = document.getElementById("dia")
function refreshDia() {
    let timeElapsed = Date.now();
    let dateString = new Date(timeElapsed);
    let formattedString = dateString.toLocaleDateString();
    mostrarDia.innerHTML = formattedString;
}
setInterval(refreshDia, 0)

//Mostrar o horário no momento
const timeDisplay = document.getElementById("time")
function refreshTime() {
    let timeElapsed = Date.now();
    let dateString = new Date(timeElapsed).toLocaleTimeString();
    let formattedString = dateString;
    timeDisplay.innerHTML = formattedString;
}
setInterval(refreshTime, 0)

const alert = document.querySelector('.alert');
setTimeout(()=>alert.style.display = 'none', 4500);

