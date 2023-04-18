const express = require('express');
const cors    = require('cors')

class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPath = '/api/usuarios';

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();
  }

  middlewares() {
    // Directorio público
    this.app.use( express.static('public') );
    this.app.use( cors() );

    // Parseo y lectura del body
    this.app.use( express.json() );
  }

  routes() {
    
    this.app.use( this.usuariosPath, require('../routes/user.routes') );

  }

  serverListen() {
    this.app.listen( this.port, () => {
      console.log(`Server listening at port ${this.port}`)
  });
  }

}


module.exports = Server;