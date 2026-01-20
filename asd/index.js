const socket = io("http://localhost:3000");
const form = document.getElementById("form");
const input = document.getElementById("input");
const mesaEspera = document.getElementById("mesa-espera");
const pIdMesa = document.getElementById("id-mesa");
const nombreCreado = document.getElementById("nombre-creador");
const divMesas = document.getElementById("mesas-disponibles");
const divJugadores = document.getElementById("jugadores");
const btnListo = document.getElementById("btn-listo");
const mesaConJugadores = document.getElementById("mesa-con-jugadores")
let miMesa = null;

socket.on("mesas-disponibles", (mesas) => {
   divMesas.innerHTML = "";
   const infoMesas = mesas;
   infoMesas.map(m => {
      const btn = document.createElement("button");
      btn.textContent = "Ingresar";
      btn.setAttribute("data-id", m.id);
      btn.setAttribute("id", "btn-ingresar")
      const div = document.createElement("div");
      div.classList.add("div-mesa")
      const pId = document.createElement("p");
      const pCreador = document.createElement("p");
      const pJugadores = document.createElement("p");
      pId.textContent = "Numero de mesa: " + m.id;
      pCreador.textContent = "Creador: " + m.nombreCreador;
      pJugadores.textContent = "Cantidad Jugadores: " + m.jugadores;
      div.appendChild(pId);
      div.appendChild(pCreador);
      div.appendChild(pJugadores);
      div.appendChild(btn);
      divMesas.appendChild(div);
   })
})

divMesas.addEventListener("click", (e) => {
   if (e.target.dataset.id) {
      let nombre = input.value.trim();
      if (!nombre) {
         nombre = prompt("Escribi tu usuario")
      }
      const idMesa = e.target.dataset.id;
      socket.emit("unirse-mesa", { idMesa, nombre });
   }
})

form.addEventListener("submit", (e) => {
   e.preventDefault();
   if (input.value) {
      const nombreUsuario = input.value;
      socket.emit("crear-mesa", nombreUsuario);
   }
})

socket.on("crear-mesa", (mesa) => {
   miMesa = mesa.id;
   mostrarSalaEspera(mesa);
})

socket.on("confirmacion-ingreso", (mesa) => {
   mostrarSalaEspera(mesa);
})

socket.on("actualizar-mesa", (mesa) => {
   miMesa = mesa.id;
   mostrarSalaEspera(mesa);
});

btnListo.addEventListener("click", () => {
   socket.emit("jugador-listo", miMesa);
})

socket.on("iniciar-partida", (mesa) => {
   mesaConJugadores.innerHTML = "";

   mesa.jugadores.forEach(j => {
      const divJugador = document.createElement("div");
      const pnombre = document.createElement("p");
      const ul = document.createElement("ul");

      divJugador.classList.add("div-jugador");

      pnombre.textContent = j.nombre;

      divJugador.appendChild(pnombre);

      j.cartas.forEach(c => {
         const li = document.createElement("li");
         li.textContent = `${c.palo} - ${c.numero}`;
         ul.appendChild(li);
      })
      divJugador.appendChild(ul);
      mesaConJugadores.appendChild(divJugador);

   })
   form.style.display = "none";
   mesaEspera.style.display = "none";
   divMesas.style.display = "none";
   mesaConJugadores.style.display = "flex";
})











function mostrarSalaEspera(mesa) {
   divJugadores.innerHTML = "";
   form.style.display = "none";
   divMesas.style.display = "none";
   mesaEspera.style.display = "flex";

   const idmesa = mesa.id;
   const nombrecreador = mesa.jugadores[0].nombre;

   pIdMesa.textContent = "Mesa: " + idmesa;
   nombreCreado.textContent = "Nombre Creador: " + nombrecreador;

   const ul = document.createElement("ul");


   mesa.jugadores.forEach(j => {
      const li = document.createElement("li");
      li.textContent = j.nombre + (j.ready === false ? " - Esperando" : " - Listo");
      ul.appendChild(li);
   })

   divJugadores.appendChild(ul);
}