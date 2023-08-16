const { Router } = require("express");
const {
  obtenerProductos,
  crearProducto,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
} = require("../controllers/productos.controllers");
const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarCampos, esAdminRole } = require("../middlewares");
const {
  estaDisponibleNombreProd,
  existeProductoPorID,
  existeCategoriaPorID,
} = require("../helpers/db-validators");

const router = Router();

router.get("/", obtenerProductos);

router.get(
  "/:id",
  [
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(existeProductoPorID),
    validarCampos,
  ],
  obtenerProductoPorId
);

router.post(
  "/",
  [
    validarJWT,
    check(
      "nombre",
      "El nombre del producto es requerido, por favor inserte uno"
    )
      .not()
      .isEmpty(),
    check("nombre").custom(estaDisponibleNombreProd),
    check("categoria", "El id no coincide con un id de MongoDB").isMongoId(),
    check("categoria").custom(existeCategoriaPorID),
    validarCampos,
  ],
  crearProducto
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "El id no coincide con un id de MongoDB").isMongoId(),
    check("id").custom(existeProductoPorID),
    check("categoria", "El id no coincide con un id de MongoDB").isMongoId(),
    validarCampos,
  ],
  actualizarProducto
);

router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "El id no coincide con un id de MongoDB").isMongoId(),
    check("id").custom(existeProductoPorID),
    validarCampos,
  ],
  eliminarProducto
);

module.exports = router;
