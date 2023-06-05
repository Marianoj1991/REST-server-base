const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const UsuarioModelo = require('../model/usuario');

const validarJWT = async ( req = request, res = response, next ) => {

  const token = req.header( 'x-token' );
  if(!token) {
    return res.status(401).json({
      msg: 'No hay token en la petición'
    })
  }

  try {
    
    const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
    // leer el modelo que corresponde al uid
    const usuario = await UsuarioModelo.findById(uid);
    if(!usuario) {
      return res.status(401).json({
        msg:'Token no válido - Usuario no existe en DB'
      })
    }

    if( !usuario.estado ) {
      return res.status(401).json({
        msg:'Token no válido - Usuario inactivo'
      })
    }

    // req.usuario = 
    req.usuario = usuario;
 
    next();

  } catch( err ) {
    console.log(err);
    res.status( 401 ).json({
      msg: 'Token no válido'
    })
  }


}

module.exports = {
    validarJWT
}