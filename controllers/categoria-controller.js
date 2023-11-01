const HttpError = require("../models/http.error");
const Categoria = require("../models/categoria");
const { validationResult } = require("express-validator");

// Listar todas las categorías
const listarCategorias = async (req, res, next) => {
  let categorias;
  try {
    categorias = await Categoria.find();
  } catch (err) {
    return next(new HttpError("No se pudieron listar las categorías.", 500));
  }
  res.json({ categorias: categorias });
};

// Listar una categoría por su ID
const getCategoriaPorId = async (req, res, next) => {
  const categoriaId = req.params.cid;
  let categoria;
  try {
    categoria = await Categoria.findById(categoriaId);
  } catch (err) {
    return next(new HttpError("No se pudo encontrar la categoría.", 500));
  }
  if (!categoria) {
    return next(new HttpError("Categoría no encontrada.", 404));
  }
  res.json({ categoria: categoria.toObject({ getters: true }) });
};

// Crear una nueva categoría
const crearCategoria = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      
      const errorMap = {
        nombre: "Debes ingresar un nombre a la categoria",

      };
      const individualErrors = errors.array().map((error) => {
  
        const message = errorMap[error.path];
  
        return message ? message : "Revisar los datos";
      });
  
      if (individualErrors.length > 0) {
        return next(new HttpError(individualErrors, 422));
      }
    }
  
    const { nombre } = req.body;
  
    try {
      const categoriaExistente = await Categoria.findOne({ nombre });
  
      if (categoriaExistente) {
        return next(new HttpError("La categoría ya existe.", 422)); // Código de estado 422 para "Unprocessable Entity"
      }
  
      const nuevaCategoria = new Categoria({
        nombre,
      });
  
      await nuevaCategoria.save();
      res.status(201).json({ categoria: nuevaCategoria });
    } catch (err) {
      return next(new HttpError("No se pudo crear la categoría.", 500));
    }
  };
  
// Actualizar una categoría por su ID
const actualizarCategoria = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(new HttpError("Ingreso invalido, por favor revisar ", 422));
  }
  
  const categoriaId = req.params.cid;
  const { nombre } = req.body;


  let categoria;
  try {
    categoria = await Categoria.findById(categoriaId);
  } catch (err) {
    return next(new HttpError("Algo salio mal al buscar la categoria.", 500));
  }

  if (!categoria) {
    return next(new HttpError("Categoría no encontrada.", 404));
  }

  categoria.nombre = nombre;

  try {
    await categoria.save();
  } catch (err) {
    return next(new HttpError("No se pudo actualizar la categoría.", 500));
  }
  res.status(200).json({ categoria: categoria.toObject({ getters: true }) });
};

// Borrar una categoría por su ID
const borrarCategoria = async (req, res, next) => {
  const categoriaId = req.params.cid;

  try {
    const categoria = await Categoria.findByIdAndRemove(categoriaId);

    if (!categoria) {
      return next(new HttpError("Categoría no encontrada.", 404));
    }

    res.status(200).json({ message: "Categoría eliminada." });
  } catch (err) {
    return next(new HttpError("No se pudo eliminar la categoría.", 500));
  }
};


module.exports = {
  listarCategorias,
  getCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  borrarCategoria,
};
