const { connect } = require("mongoose");

async function conectarDB() {
    await connect("mongodb://localhost:27017/playersDB");
}

module.exports = { conectarDB };