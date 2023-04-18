require('dotenv').config();

// Importamos la class Server
const Server = require('./model/server');

// Instanciamos la clase server
const server = new Server();

server.serverListen();

