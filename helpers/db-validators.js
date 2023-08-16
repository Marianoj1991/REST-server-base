// Importamos el modelo de Role
const Role = require("../model/role");

// Importamos el modelo Usuario
const { Usuario } = require("../model");

// Importamos el modelo de categoria
const { Categoria } = require('../model');

// Importamos el modelo de Producto
const { Producto } = require('../model')

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

/**
 * Categorias 
 */

const existeCategoriaPorID = async ( id ) => {
  const existeId = await Categoria.findById( id );
  if (!existeId) {
    throw new Error(`El ID, ${id}, ingresado no existe en la colección de categorias de la DDBB`);
  }
};

const estaDisponibleCatNombre = async ( reqNombre ) => {
  const nombre = reqNombre.toUpperCase();
  const categoria = await Categoria.findOne({ nombre });
  if( categoria ) {
    throw new Error(`El nombre, ${nombre} ya ha sido registrado en una categoria`)
  }
}

/**
 * Productos
 */
const estaDisponibleNombreProd = async ( reqNombre = '' ) => {
  const nombre = reqNombre.toLowerCase();
  const producto = await Producto.findOne({nombre});
  if( producto ) {
    throw new Error(`Ya existe un producto registrado con el nombre ${nombre}`);
  }
}

const existeProductoPorID = async ( id ) => {
  const producto = await Producto.findById( id );
  if (!producto) {
    throw new Error(`El ID, ${id}, ingresado no existe en la colección de categorias de la DDBB`);
  }
};



module.exports = {
  esRolValido,
  existeMailFunc,
  existeUsuarioPorID,
  existeCategoriaPorID,
  estaDisponibleCatNombre,
  estaDisponibleNombreProd,
  existeProductoPorID
};
