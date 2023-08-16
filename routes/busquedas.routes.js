const { Router } = require('express');
const { busquedaControlador } = require('../controllers/busqueda.controllers');

const router = Router();

router.get('/:coleccion/:termino', busquedaControlador );


module.exports = router