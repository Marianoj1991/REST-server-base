const { request, response } = require("express");
const bcryptjs = require("bcryptjs");

const { Usuario } = require("../model");


const { generarJTW } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req = request, res = response) => {
  const { correo, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });
    
    //VERIFICAR SI EL CORREO EXISTE
    if (!usuario) {
      return res.status(401).json({
        msg: "Usuario | Password no son correctos - Correo",
      });
    }

    //VERIFICAR SI EL USUARIO ESTA ACTIVO
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Usuario | Password no son correctos - Estado: false",
      });
    }

    //VERIFICAR LA CONTRASEÑA
    const validPassword = bcryptjs.compareSync(contraseña, usuario.contraseña);
    if (!validPassword) {
      return res.status(401).json({
        msg: "Usuario | Password no son correctos - Contraseña",
      });
    }

    // GENERAR EL JWT
    const token = await generarJTW(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

const googleSignIn = async (req = request, res = response) => {
  
  const { id_token } = req.body;

  try {
    const { correo, nombre, img } = await googleVerify(id_token);

    let usuario = await Usuario.findOne({correo});
    
    if( !usuario ){ 
      const data = {
        nombre,
        correo,
        contraseña: ':P',
        img,
        google: true,
        rol: 'USER_ROLE'
      }

      usuario = new Usuario( data );
      await usuario.save();
    }

    if( !usuario.estado ) {
      return res.status(401).json({
        msg: 'Hable con el administrador. Usuario bloqueado'
      })
    }

    // GENERAR EL JWT
    const token = await generarJTW( usuario.id );   

    res.json({
      usuario,
      token,
      id_token
    });

  } catch (err) {
    console.log(err);
    json.status(401).json({
      ok: false,
      msg: "Google Token no se pude verificar",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
