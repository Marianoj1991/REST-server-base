const { request, response } = require("express");
const bcryptjs = require('bcryptjs');

const UserModel = require('../model/usuario');
const { generarJTW } = require("../helpers/generar-jwt");

const login = async (req = request, res = response) => {
  
  const { correo, contraseña } = req.body;

  try {
    
    const usuario = await UserModel.findOne({ correo });
    //VERIFICAR SI EL CORREO EXISTE
    if(!usuario) {
      return res.status(400).json({
        msg: 'Usuario | Password no son correctos - Correo', 
      })
    }

    //VERIFICAR SI EL USUARIO ESTA ACTIVO
    if( !usuario.estado ) {
      return res.status(400).json({
        msg: 'Usuario | Password no son correctos - Estado: false'
      })
    }

    //VERIFICAR LA CONTRASEÑA
    const validPassword = bcryptjs.compareSync( contraseña, usuario.contraseña );
    if( !validPassword ) {
      return res.status(400).json({
        msg: 'Usuario | Password no son correctos - Contraseña'
      });
    }

    // GENERAR EL JWT
    const token = await generarJTW( usuario.id );

    res.json({
      usuario,
      token
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      msg: "Hable con el administrador",
    });
  }

};

module.exports = {
  login,
};
