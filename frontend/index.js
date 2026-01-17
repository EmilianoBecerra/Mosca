const socket = io("http://localhost:3000");
const form = document.getElementById("form");
const input = document.getElementById("input");

form.addEventListener("submit", (e) => {
   e.preventDefault();
   if (input.value) {
      const nombreUsuario = input.value;
      socket.emit("nuevoJugador", nombreUsuario);
   }
})

socket.on("bienvenida", (msg) => {
   console.log(msg)
})

socket.on("jugador-nuevo", (msgSala) => {
   console.log(msgSala)
})

