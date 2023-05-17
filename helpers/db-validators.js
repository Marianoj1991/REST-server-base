// Importamos el modelo de Role
const Role = require("../model/role");

// Importamos el modelo Usuario
const Usuario = require("../model/usuario");

const esRolValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no esta registrado en la base de DDBB`);
  }
};

// Verificar si el correo existe
const existeMailFunc = async ( correo ) => {
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error(`El mail, ${correo}, ingresado ya ha sido utilizado`);
  }
};

// Verificamos si el ID existe en la DDBB
const existeUsuarioPorID = async ( id ) => {
  const existeId = await Usuario.findById( id );
  if (!existeId) {
    throw new Error(`El ID, ${id}, ingresado no existe en la DDBB`);
  }
};



module.exports = {
  esRolValido,
  existeMailFunc,
  existeUsuarioPorID
};
