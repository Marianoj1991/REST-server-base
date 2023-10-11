const { response, request } = require("express");
const { Usuario, Categoria, Producto } = require("../model");
const { ObjectId } = require('mongoose').Types;

const coleccinesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles',
]

const buscarUsuarios = async ( termino = '', res = response ) => {

    const esMongoId = ObjectId.isValid( termino );

    if( esMongoId ) {  
        const usuario = await Usuario.findById(termino);
        
        return res.json({
           results: ( usuario ) ? [ usuario ] : []
        })
    }

    const regex = new RegExp( termino, 'i' );

    const usuario = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });
    return res.json({
        results: usuario
     })
}

const buscarCategorias = async ( termino = '', res = response ) => {

    const esMongoId = ObjectId.isValid( termino );
    if( esMongoId ) {
        const categoria = await Categoria.findById(termino)
            .populate('usuario', 'nombre');
        return res.json({
            msg: 'Categoria encontrada',
            results: (categoria) ? categoria : []
        })
    }

    const regex = new RegExp( termino, 'i' )    ;
    const categoria = await Categoria.find({
        $and: [{nombre: regex}, {estado: true}]
    })
        .populate('usuario', 'nombre')

    return res.json({
        msg: 'Categoria encontrada con éxito',
        results: (categoria) ? categoria : []
    })

}

const buscarProductos = async ( termino = '', res = response ) => {

    const esMongoId = ObjectId.isValid( termino );
    if( esMongoId ) {
            const producto = await Producto.findById(termino)
                .populate( 'usuario', 'nombre' )
                .populate( 'categoria', 'nombre' );
            return res.json({
                results: (producto) ? producto : {}
            })
    }

    const regex = new RegExp( termino, 'i' );
    const producto = await Producto.find({
        $and: [{ nombre: regex }, { estado: true }]        
    })
    .populate( 'usuario', 'nombre' )
    .populate( 'categoria', 'nombre' );

    return res.json({
        results: (producto) ? producto : []
    })
}

const busquedaControlador = async ( req = request, res = response ) => {

    const { coleccion, termino } = req.params;

    if( !coleccinesPermitidas.includes( coleccion ) ) {
        res.status(400).json({
            msg: `Las colecciones permititdas son: ${coleccinesPermitidas}`
        })
    }
    
    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios( termino, res );
            break;
        case 'categorias':
            buscarCategorias( termino, res );
            break;
        case 'productos':
            buscarProductos( termino, res );
            break;
    
        default:
            res.status(500).json({
                msg: 'Se me olvidó hacer esta búsqueda'
            });
    }
} 

module.exports = {
    busquedaControlador,
}