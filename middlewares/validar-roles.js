const { request, response } = require("express");

const esAdminRole = async ( req = request, res = response, next  ) => {

  if( !req.usuario ) {
    return res.status( 500 ).json({
      msg: 'Se quiere verificar el rol sin válidar el token primero'
    });
  };

  const { rol, nombre } = req.usuario;

  if( rol !== 'ADMIN_ROLE' ) {
    return res.status(401).json({
      msg: `${nombre} no es administrador - no puede realizar esta acción`
    }) 
    } else {
      next();
    };

}

const tieneRole = ( ...roles ) => {
  return ( req = request, res = response, next ) => {
    if( !req.usuario ) {
      return res.status( 500 ).json({
        msg: 'Se quiere verificar el rol sin válidar el token primero'
      });
    } else if ( !roles.includes( req.usuario.rol ) ) {
      return res.status( 401 ).json({
        msg: `El servicio require uno de estos roles ${ roles }`
      });
    }
    
    next();
  }
}

module.exports = {
    esAdminRole,
    tieneRole
}
