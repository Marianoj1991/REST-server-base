const { request, response } = require("express");
const { Producto } = require("../model");


const obtenerProductos = async ( req = request, res = response ) => {

    const { limit = 0, skip = 0 } = req.query 

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments({estado: true}),
        Producto.find({estado: true})
            .limit( limit )
            .skip( skip )
            .populate('categoria', 'nombre')
            .populate('usuario', 'nombre')
    ])

    res.json({
        total,
        productos,
        msg: 'Productos obtenidos'
    })
}

const obtenerProductoPorId = async ( req = request, res = response ) => {

    const { id } = req.params;
    try {
        const producto = await Producto.findById( id )
                        .populate('categoria', 'nombre')
                        .populate('usuario', 'nombre');
        if( producto ) {
           res.status(200).json({
            msg: 'Producto Obtenido',
            producto
           }) 
        }
    } catch( err ) {
        res.status(400).json({
            msg: 'Producto no encontrado'
        })
    }
}

const crearProducto = async ( req = request, res = response ) => {

    const nombre = req.body.nombre.toLowerCase();
    const { estado, usuario, ...body } = req.body;
    const data = {
        ...body,
        nombre,
        usuario: req.usuario._id,
    }

    const producto = new Producto( data );
    await producto.save();

    res.json({
        msg: 'POST | Producto Creado',
        producto,
    })
}

const actualizarProducto = async ( req = request, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if( data.nombre ) {
        data.nombre = data.nombre.toLowerCase();
    } 

    data.usuario = req.usuario._id; 

    const productoActualizado = await Producto.findByIdAndUpdate( id, data, { new: true })
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
    
    res.json({
        productoActualizado,
        msg: 'PUT | Producto Actualizado'
    })
}

const eliminarProducto = async ( req = request, res = response ) => {

    const { id } = req.params;
    const producto = await Producto.findByIdAndUpdate( id, { estado: false }, { new: true } );
    res.json({
        producto,
        msg: 'DELETE | Producto eliminado'
    })
}

module.exports = { 
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto, 
    actualizarProducto,
    eliminarProducto
}