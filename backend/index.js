const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const { enviarMesasDisponibles } = require("./utils/mesa.js")
const MesaController = require("./socket/MesaController.js");
const PartidaController = require("./socket/PartidaController.js");

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    }
});

const mesas = {};
const mesaController = new MesaController(io, mesas);
const partidaController = new PartidaController(io, mesas);

io.on("connection", (socket) => {
    socket.emit("mesas-disponibles", enviarMesasDisponibles(mesas));

    mesaController.registrar(socket);
    partidaController.registrar(socket);
})

server.listen(3000, () => {
    console.log("Servidor escuchando el puerto 3000");
})