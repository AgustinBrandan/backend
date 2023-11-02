const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http.error");
const Categoria = require('../models/categoria');
const Producto = require("../models/producto");

const listarProductos = async (req, res, next) => {
  try {
    const productos = await Producto.find();
    res.status(200).json(productos);
  } catch (err) {
    return next(
      new HttpError("Algo salió mal, no se pudo encontrar productos", 500)
    );
  }
};
const listarProductosPorCategoria = async (req, res, next) => {
  const { nombreCategoria } = req.params;

  try {
    // Encuentra la categoría correspondiente
    const categoria = await Categoria.findOne({ nombre: nombreCategoria });

    if (!categoria) {
      return next(new HttpError('Categoría no encontrada', 404));
    }

    // Busca productos con la categoría encontrada
    const productos = await Producto.find({ categoria: categoria._id });

    const productosConCategoria = await Promise.all(
      productos.map(async (producto) => {
        // Aquí puedes agregar más campos de la categoría si es necesario
        const categoria = await Categoria.findById(producto.categoria);
        return {
          ...producto.toObject({ getters: true }),
          categoria: categoria.toObject({ getters: true }),
        };
      })
    );

    res.status(200).json(productosConCategoria);
  } catch (err) {
    return next(new HttpError('Algo salió mal, no se pudieron encontrar productos por categoría', 500));
  }
};


const obtenerProductoPorId = async (req, res, next) => {
  const { id } = req.params;

  try {
    const producto = await Producto.findById(id);
    if (!producto) {
      return next(new HttpError("Producto no encontrado.", 404));
    }
    res.status(200).json(producto);
  } catch (err) {
    return next(new HttpError("Algo salió mal al buscar el producto.", 500));
  }
};

const crearProducto = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMap = {
      nombre: "El nombre no puede estar vacío",
      precio: "El precio debe ser un número válido",
      descripcion: "La descripción debe tener al menos 5 caracteres",
      cantidad: "La cantidad debe ser un numero valido",
    };

    const individualErrors = errors.array().map((error) => {
      const message = errorMap[error.path];
      return message ? message : "Revisar los datos";
    });

    if (individualErrors.length > 0) {
      return next(new HttpError(individualErrors, 422));
    }
  }

  const { nombre, precio, descripcion, cantidad, categoria } = req.body;

  try {
    let categoriaExistente = null;

    if (categoria) {
      // Verificar si se proporcionó una categoría
      categoriaExistente = await Categoria.findOne({ nombre: categoria });

      if (!categoriaExistente) {
        return next(new HttpError("La categoría especificada no existe.", 404));
      }
    }

    const producto = new Producto({
      nombre,
      precio,
      descripcion,
      cantidad,
      categoria: categoriaExistente, // Asignar la categoría existente o nula si no se proporciona
    });

    await producto.save();
    res.status(201).json(producto);
  } catch (error) {
    return next(new HttpError("No se pudo crear el producto.", 500));
  }
};

const actualizarProducto = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(new HttpError("Ingreso invalido, por favor revisar ", 422));
  }

  const { precio, cantidad } = req.body;
  const productoId = req.params.pid;

  try {
    let producto;

    try {
      producto = await Producto.findById(productoId);
    } catch (err) {
      return next(new HttpError("Algo salió mal al buscar el producto.", 500));
    }

    if (!producto) {
      return next(
        new HttpError("No se encontró el producto para actualizar.", 404)
      );
    }

    // Actualiza los campos "precio" y "cantidad"
    producto.precio = precio;
    producto.cantidad = cantidad;

    try {
      await producto.save();
    } catch (err) {
      return next(new HttpError("No se pudo actualizar el producto.", 500));
    }

    res.status(200).json({ producto: producto.toObject({ getters: true }) });
  } catch (error) {
    return next(
      new HttpError("Algo salió mal al actualizar el producto.", 500)
    );
  }
};

const borrarProducto = async (req, res, next) => {
  const { id } = req.params;

  try {
    const producto = await Producto.findByIdAndRemove(id);
    if (!producto) {
      return next(new HttpError("Producto no encontrado.", 404));
    }
    res.status(200).json({ message: "Producto Eliminado." });
  } catch (err) {
    return next(new HttpError("No se pudo eliminar el producto.", 500));
  }
};

module.exports = {
  listarProductos,
  listarProductosPorCategoria,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  borrarProducto,
};
