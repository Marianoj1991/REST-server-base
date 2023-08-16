const { request, response } = require("express");

// Modelo de Categoria importado
const { Categoria } = require("../model");

// Obtener categorias - paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {
  const { limit = 0, skip = 0 } = req.query;

  const [totalCategorias, categorias] = await Promise.all([
    Categoria.countDocuments({ estado: true }),
    Categoria.find({ estado: true })
      .limit(limit)
      .skip(skip)
      .populate("usuario", 'nombre'),
  ]);

  res.status(200).json({
    totalCategorias,
    categorias,
  });
};

// Obtener categoria por ID
const obtenerCategoriaPorId = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const categoria = await Categoria.findById(id).populate("usuario");
    res.status(200).json({
      msg: "Categoria Obtenida",
      categoria,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      msg: "No se pudo obtener categoria por id, verifique las credenciales",
    });
  }
};

const crearCategoria = async (req = request, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  try {
    const data = {
      nombre,
      usuario: req.usuario._id,
    };

    const categoria = new Categoria(data);

    await categoria.save();

    res.status(201).json({
      categoria,
      msg: "Categoria Creada En DDBB",
    });
  } catch (err) {
    return res.status(400).json({ err });
  }
};

const actualizarCategoria = async (req = request, res = Response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  const categoriaActualizada = await Categoria.findByIdAndUpdate( id, data, { new: true } ).populate('usuario');

  res.status(200).json({
    msg: "PUT | Actualizar Categoria",
    categoriaActualizada,
  });
};

const borrarCategoria = async ( req = request, res = response ) => {
  const { id } = req.params;

  const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {estado: false}, { new: true }).populate('usuario');

  res.status(201).json({ 
    msg: 'Se actualizó la categoria',
    categoriaBorrada,
  })
}

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoriaPorId,
  actualizarCategoria,
  borrarCategoria
};
