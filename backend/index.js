const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const { crearMesa } = require("./utils/mesa.js")


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
    socket.emit("bienvenida", "Conectado al servidor");

    socket.on("crear-mesa", (nombre) => {
        const nuevaMesa = crearMesa(socket.id, nombre);
        mesas[nuevaMesa.id] = nuevaMesa;
        socket.join(nuevaMesa.id);
        socket.emit("crear-mesa", nuevaMesa);
        console.log(mesas);
    })
})




server.listen(3000, () => {
    console.log("Servidor escuchando el puerto 3000");
})