const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const { enviarMesasDisponibles } = require("./utils/mesa.js")
const MesaController = require("./socket/MesaController.js");
const PartidaController = require("./socket/PartidaController.js");
const JugadoresController = require("./socket/JugadoresController.js");
const { conectarDB } = require("./db/config.js");

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mesas = {
    1: {
        id: 1,
        nombre: "default-1",
        mazo: [],
        triunfo: "",
        estado: "esperando-jugadores",
        fase: "en-espera",
        turnoActual: 0,
        repartidor: 0,
        cartasPorRonda: [],
        ronda: 0,
        jugadores: []
    },
    2: {
        id: 2,
        nombre: "default-2",
        mazo: [],
        triunfo: "",
        estado: "esperando-jugadores",
        fase: "en-espera",
        turnoActual: 0,
        repartidor: 0,
        cartasPorRonda: [],
        ronda: 0,
        jugadores: []
    },
    3: {
        id: 3,
        nombre: "default-3",
        mazo: [],
        triunfo: "",
        estado: "esperando-jugadores",
        fase: "en-espera",
        turnoActual: 0,
        repartidor: 0,
        cartasPorRonda: [],
        ronda: 0,
        jugadores: []
    }

};

const mesaController = new MesaController(io, mesas);
const partidaController = new PartidaController(io, mesas);
const jugadoresController = new JugadoresController(io);

io.on("connection", (socket) => {
    socket.emit("mesas-disponibles", enviarMesasDisponibles(mesas));

    mesaController.registrar(socket);
    partidaController.registrar(socket);
    jugadoresController.registrar(socket);
})

server.listen(3000, () => {
    console.log("Servidor escuchando el puerto 3000");
    conectarDB().then(() => console.log("Se conecto la base de datos"));
})