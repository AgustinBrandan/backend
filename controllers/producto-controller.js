
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http.error");

const Producto = require('../models/producto'); // Importa el modelo de Producto

const listarProductos = async (req, res, next) => {
  try {
    const productos = await Producto.find();
    res.status(200).json(productos);
  } catch (err) {
    return next(new HttpError("Algo salió mal, no se pudo encontrar productos", 500));
  }
};
const listarProductosPorCategoria = async (req, res, next) => {
  const { categoria } = req.params; // Obtiene la categoría de los parámetros de la ruta

  try {
    const productos = await Producto.find({ categoria }); // Busca productos por la categoría
    res.status(200).json(productos);
  } catch (err) {
    return next(new HttpError('Algo salió mal, no se pudo encontrar productos por categoría', 500));
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
    // Se define un objeto `errorMap` que mapea los nombres de campo a los mensajes de error correspondientes.
    const errorMap = {
      nombre: "El nombre no puede estar vacío",
      precio: "El precio debe ser un número válido",
      descripcion: "La descripción debe tener al menos 5 caracteres",
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
    const producto = new Producto({
      nombre,
      precio,
      descripcion,
      cantidad,
      categoria,
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
    // Se define un objeto `errorMap` que mapea los nombres de campo a los mensajes de error correspondientes.
    const errorMap = {
      precio: "El precio debe ser un número válido",
      cantidad: "La cantidad debe ser un número válido",
    };

    const individualErrors = errors.array().map((error) => {
      const message = errorMap[error.path]; // 

      return message ? message : "Revisar los datos";
    });

    if (individualErrors.length > 0) {
      return next(new HttpError(individualErrors, 422));
    }
  }

  const { precio, cantidad } = req.body; // Solo se actualizan los campos "precio" y "cantidad"
  const productoId = req.params.pid;

  try {
    let producto;

    try {
      producto = await Producto.findById(productoId);
    } catch (err) {
      return next(new HttpError("Algo salió mal al buscar el producto.", 500));
    }

    if (!producto) {
      return next(new HttpError("No se encontró el producto para actualizar.", 404));
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
    return next(new HttpError("Algo salió mal al actualizar el producto.", 500));
  }
};

const borrarProducto = async (req, res, next) => {
  const { id } = req.params;

  try {
    const producto = await Producto.findByIdAndRemove(id);
    if (!producto) {
      return next(new HttpError("Producto no encontrado.", 404));
    }
    res.status(204).end(); // Envía una respuesta sin contenido (204) para indicar que la eliminación fue exitosa.
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

