const socket = io("http://localhost:3000");
const form = document.getElementById("form");
const input = document.getElementById("input");
const mesaEspera = document.getElementById("mesa-espera");
const mesa = document.getElementById("id-mesa");
const nombreCreado = document.getElementById("nombre-creador");
const mesas = {}


form.addEventListener("submit", (e) => {
   e.preventDefault();
   if (input.value) {
      const nombreUsuario = input.value;
      socket.emit("crear-mesa", nombreUsuario);
   }
})

socket.on("crear-mesa", (nuevaMesa) => {
   const idmesa = nuevaMesa.id;
   const nombrecreador = nuevaMesa.jugadores[0].nombre;
   nombreCreado.textContent = `Nombre Creador: ${nombrecreador}`;
   mesa.textContent = `Id Mesa: ${idmesa}`;
   console.log(idmesa, nombreCreado)
   if (nuevaMesa) {
      form.style.display = "none";
      mesaEspera.style.display = "flex";
   }
})



