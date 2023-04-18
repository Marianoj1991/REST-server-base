const { response, request } = require('express');

const usersGet = ( req = request, res = response ) => {

  const { q, nombre = 'No name', api_key, page = 2, limit = 5 } = req.query;
  res.json({
    msg: 'get API - controller',
    q,
    nombre,
    api_key, 
    page, 
    limit
  });
};

const usersPost = ( req, res = response ) => {

  const { edad, nombre, apellido, id } = req.body;

  res.json({
    msg: 'post API - controller',
    edad, 
    nombre,
    apellido, 
    id
  })
};

const usersPut = ( req, res = response ) => {
  const id = req.params.id;
  res.json({
    msg: 'put API - controller',
    id,
  })
};

const usersDelete = ( req, res = response ) => {
  res.json({
    msg: 'delete API - controller'
  })
};

module.exports = {
    usersGet,
    usersPost,
    usersDelete,
    usersPut
}