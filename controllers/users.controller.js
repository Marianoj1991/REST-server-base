const { response, request } = require('express');

// Modelo de Usuario importado
const Usuario = require('../model/usuario');

const bcryptjs = require('bcryptjs');

const usersGet = async ( req = request, res = response ) => {

  const { limite = 5, desde = 0 } = req.query;
  if(isNaN( desde )) {
    return res.status(400).json({
      msg: `El parámatro ingresado es incorrecto`
    }) 
  };

  // const usuarios = await Usuario.find( { estado: true } )
  //   .skip( desde )
  //   .limit( limite )

  // const total = await Usuario.countDocuments({ estado: true });

  // EL "PROMISE.ALL" NOS PERMITE ENVIAR UN ARRAY DE PROMESAS QUE QUEREMOS QUE SE EJECUTEN EN SIMULTÁNEO. AHORA, SI UNA DE ELLAS ES RECHAZADAS TODAS SERÁN RECHAZADAS. EL RETORNO DE PROMISE.ALL ES UN ARRAY CON LOS RESULTADOS DE LAS PROMESAS, POR LO TANTO PODEMOS DESESTRUCTURAR
  const [ total, usuarios ] = await Promise.all([ 
    Usuario.countDocuments({ estado: true }), // LOS METODOS DE BÚSQUEDA DE MONGO, PUEDEN ACEPTAR UN PARÁMETRO DE CONFIGURACIÓN. EJ: SOLO LOS USUARIOS ACTIVOS
    await Usuario.find( { estado: true } )
      .skip( desde )
      .limit( limite )
   ])

  res.json({
    total,
    usuarios
  });
};

const usersPost = async ( req, res = response ) => {

  const { nombre, correo, contraseña, rol } = req.body;
  const usuario = new Usuario( { nombre, correo, contraseña, rol } );

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.contraseña = bcryptjs.hashSync( contraseña, salt );

  // Guardar en DB
  await usuario.save();

  res.json({
    usuario
  });
};

const usersPut = async ( req, res = response ) => {
  const { id } = req.params;
  const { google, contraseña, correo, ...resto } = req.body;
  
  if( contraseña ) {
    const salt = bcryptjs.genSaltSync();
    resto.contraseña = bcryptjs.hashSync( contraseña, salt );
  }

  const usuario = await Usuario.findByIdAndUpdate( id,resto );

  res.json({
    usuario
  })
};

const usersDelete = async ( req, res = response ) => {

  const { id } = req.params;

  // ESTA ES LA FORMA RECOMENDADA.
  const usuarioBorrado = await Usuario.findByIdAndUpdate( id, { estado: false } );

  res.json({
    msg: 'delete API - controller',
    id,
    usuarioBorrado,
  })
};

module.exports = {
    usersGet,
    usersPost,
    usersDelete,
    usersPut
}