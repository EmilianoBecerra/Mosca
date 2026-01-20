const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const { crearMesa, enviarMesasDisponibles, agregarNuevoUsuario } = require("./utils/mesa.js")
const { crearMazo, mezclarMazo, repartirCartas } = require("./utils/cartas.js")


const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5500",
    }
});

app.get("/", (req, res) => {
    res.send("<h1>Holaa</h1>")
})

const mesas = {};




io.on("connection", (socket) => {
    socket.emit("mesas-disponibles", enviarMesasDisponibles(mesas));
    socket.on("crear-mesa", (nombre) => {
        const nuevaMesa = crearMesa(socket.id, nombre);
        mesas[nuevaMesa.id] = nuevaMesa;
        socket.join(nuevaMesa.id);
        socket.emit("crear-mesa", nuevaMesa);
        io.emit("mesas-disponibles", enviarMesasDisponibles(mesas));
    })


    socket.on("unirse-mesa", ({ idMesa, nombre }) => {
        const jugador = agregarNuevoUsuario(idMesa, nombre, mesas, socket.id);

        if (!jugador) {
            socket.emit("error", "No se pudo unir a la mesa");
            return;
        }

        socket.join(idMesa);
        io.to(idMesa).emit("actualizar-mesa", mesas[idMesa]);
        socket.emit("confirmacion-ingreso", mesas[idMesa]);
        io.emit("mesas-disponibles", enviarMesasDisponibles(mesas));
    })

    socket.on("jugador-listo", (idMesa) => {
        const mesa = mesas[idMesa];
        const jugador = mesa.jugadores.find(j => j.idJugador === socket.id);
        jugador.ready = true;
        const todosListos = mesa.jugadores.every(j => j.ready === true);
        if (todosListos && mesa.jugadores.length >= 2) {
            mesa.estado = "en-partida"
            mesa.mazo = mezclarMazo(crearMazo());
            repartirCartas(mesa);
            io.to(idMesa).emit("iniciar-partida", mesa);
        } else {
            io.to(idMesa).emit("actualizar-mesa", mesa);
        }

    })
})


server.listen(3000, () => {
    console.log("Servidor escuchando el puerto 3000");
})