const mongoose = require('mongoose')
require('colors');

const dbConnection = async () => {
  
  try { 

    await mongoose.connect( process.env.MONGODB_CNN );

    console.log('Base de Datos Online'.bgGreen);

  } catch(err) {
    console.log(err);
    throw new Error('Error en la inicialización de la DB en Mongo'.bgRed);
  }

} 


module.exports = {
  dbConnection,
}