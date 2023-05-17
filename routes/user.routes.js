const { Router } = require("express");
const { check } = require("express-validator");

// Importamos los controladores
const {
  usersGet,
  usersPut,
  usersPost,
  usersDelete,
} = require("../controllers/users.controller");

// Importamos el middleware
const { validarCampos } = require("../middlewares/validar-campos");
const { esRolValido, existeMailFunc, existeUsuarioPorID } = require("../helpers/db-validators");

const router = Router();

router.get("/", usersGet);

router.post("/", [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('correo', 'El correo no es válido').isEmail(),
  check('correo').custom( existeMailFunc ),
  check('contraseña', 'La contraseña es obligatoria y debe tener más de 6 caracteres').isLength({ min: 6 }),
  // check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  check('rol').custom( esRolValido ),
  validarCampos
], usersPost);

router.put("/:id", [
  check('id', 'Lo siento, el ID ingresado no es un mongo ID').isMongoId(),
  check( 'id' ).custom( existeUsuarioPorID ),
  check('rol').custom( esRolValido ),
  validarCampos
] ,usersPut);

router.delete("/:id", [
  check('id', 'Lo siento, el ID ingresado no es un mongo ID').isMongoId(),
  check( 'id' ).custom( existeUsuarioPorID ),
  validarCampos
] , usersDelete);

module.exports = router;
