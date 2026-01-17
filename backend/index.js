const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("node:http");


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

io.on("connection", (socket) => {
    socket.emit("bienvenida", "Conectado al servidor");

    socket.on("nuevoJugador", (jugador) => {
        console.log(jugador)
        socket.join("sala-principal");
        io.to("sala-principal").emit("jugador-nuevo", `${jugador} se unió a la sala`);
        console.log("sala creada")
    })
})

server.listen(3000, () => {
    console.log("Servidor escuchando el puerto 3000");
})