const { Router } = require("express");
const { check } = require("express-validator");

const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");
const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoriaPorId,
  actualizarCategoria,
  borrarCategoria,
} = require("../controllers/categorias.controllers");

const {
  existeCategoriaPorID,
  estaDisponibleCatNombre,
} = require("../helpers/db-validators");

const router = Router();

// obtener todas las categorias - público
router.get("/", obtenerCategorias);

// obtener las categorias por id
router.get(
  "/:id",
  [
    check("id", "El id no coincide con un id de MongoDB").isMongoId(),
    check("id").custom(existeCategoriaPorID),
    validarCampos,
  ],
  obtenerCategoriaPorId
);

// crear una nueva categoria - cualquier persona con un token válido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "Nombre es obligatorio").not().isEmpty(),
    check("nombre").custom(estaDisponibleCatNombre),
    validarCampos,
  ],
  crearCategoria
);

// actualizar un registro por un id
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "El id no coincide con un id de MongoDB").isMongoId(),
    check("id").custom(existeCategoriaPorID),
    check("nombre", "Nombre es requerido para actualizar una categoria")
      .not()
      .isEmpty(),
    check("nombre").custom(estaDisponibleCatNombre),
    validarCampos,
  ],
  actualizarCategoria
);

// eliminar una categoria
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "El id no coincide con un id de MongoDB").isMongoId(),
    check("id").custom(existeCategoriaPorID),
    validarCampos,
  ],
  borrarCategoria
);

module.exports = router;
