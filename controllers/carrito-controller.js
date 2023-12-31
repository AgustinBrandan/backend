const Carrito = require("../models/carrito");
const Producto = require("../models/producto");
const HttpError = require("../models/http.error");

// Crear un carrito de compra vacio
const crearCarrito = async (req, res, next) => {
  const nuevoCarrito = new Carrito({
    productos: [],
    precioTotal: 0,
  });

  try {
    await nuevoCarrito.save();
    res.status(201).json(nuevoCarrito);
  } catch (error) {
    return next(new HttpError("No se pudo crear el carrito de compra.", 500));
  }
};

//Crear Carrito con lista de productos
const crearCarritoProductos = async (req, res, next) => {

  const { productos } = req.body;

  if (!productos || !Array.isArray(productos)) {
    return next(
      new HttpError("La lista de productos inválida.", 400)
    );
  }

  let precioTotal = 0;

  for (const productoInfo of productos) {
    const producto = await Producto.findById(productoInfo.producto);

    if (!producto) {
      return next(
        new HttpError("El producto no se encuentra en la base de datos.", 404)
      );
    }

    const cantidad = productoInfo.cantidad;

    // Verifica si hay suficiente stock en el producto
    if (producto.cantidad < cantidad) {
      return next(new HttpError("No hay suficiente stock disponible.", 400));
    }

    // Si hay suficiente stock, suma el precio al precio total
    precioTotal += producto.precio * cantidad;
  }

  const nuevoCarrito = new Carrito({
    productos, 
    precioTotal,
  });

  try {
    await nuevoCarrito.save();
    res.status(201).json(nuevoCarrito);
  } catch (error) {
    return next(new HttpError("No se pudo crear el carrito de compra.", 500));
  }
};

// Agregar un producto al carrito de compra
const agregarProducto = async (req, res, next) => {
  const { carritoId } = req.params;
  const { productoId, cantidad } = req.body;

  try {
    const carrito = await Carrito.findById(carritoId);
    const producto = await Producto.findById(productoId);

    if (!carrito || !producto) {
      return next(new HttpError("Carrito o producto no encontrado.", 404));
    }

    // Verificar si hay suficiente stock en el producto
    if (producto.cantidad < cantidad) {
      return next(new HttpError("No hay suficiente stock disponible.", 400));
    }

    carrito.productos.push({ producto: productoId, cantidad });
    carrito.precioTotal += producto.precio * cantidad;

    await carrito.save();
    res.status(201).json(carrito);
  } catch (error) {
    return next(
      new HttpError("No se pudo agregar el producto al carrito de compra.", 500)
    );
  }
};

// Actualizar la cantidad de un producto en el carrito de compra
const actualizarProducto = async (req, res, next) => {
  const { carritoId, productoId } = req.params;
  const { cantidad } = req.body;

  try {
    const carrito = await Carrito.findById(carritoId);

    if (!carrito) {
      return next(new HttpError("Carrito no encontrado.", 404));
    }
    // Verificar si el producto está en el carrito
    const productoEnCarrito = carrito.productos.find(
      (p) => p.producto.toString() === productoId
    );
    if (!productoEnCarrito) {
      return next(new HttpError("Producto no encontrado en el carrito.", 404));
    }

    const producto = await Producto.findById(productoId);
    if (!producto) {
      return next(new HttpError("Producto no encontrado.", 404));
    }
    // Verificar si hay suficiente stock en el producto
    if (cantidad > producto.cantidad) {
      return next(new HttpError("No hay suficiente stock disponible.", 400));
    }

    // Recalcular el precio total del carrito
    const precioOriginal = producto.precio * productoEnCarrito.cantidad;
    carrito.precioTotal += producto.precio * cantidad - precioOriginal;
    productoEnCarrito.cantidad = cantidad;

    await carrito.save();
    res.status(200).json(carrito);
  } catch (error) {
    return next(
      new HttpError(
        "No se pudo actualizar la cantidad del producto en el carrito.",
        500
      )
    );
  }
};

// Actualizar la cantidad de varios productos en el carrito de compra
const actualizarProductosEnCarrito = async (req, res, next) => {
  const { carritoId } = req.params;
  const { productos } = req.body;

  try {
    const carrito = await Carrito.findById(carritoId);

    if (!carrito) {
      return next(new HttpError("Carrito no encontrado.", 404));
    }

    for (const productoInfo of productos) {
      const productoId = productoInfo.producto;
      const cantidad = productoInfo.cantidad;

      // Verificar si el producto está en el carrito
      const productoEnCarrito = carrito.productos.find(
        (p) => p.producto.toString() === productoId
      );

      if (!productoEnCarrito) {
        return next(new HttpError("Producto no encontrado en el carrito.", 404));
      }

      const producto = await Producto.findById(productoId);

      if (!producto) {
        return next(new HttpError("Producto no encontrado.", 404));
      }

      // Verificar si hay suficiente stock en el producto
      if (cantidad > producto.cantidad) {
        return next(new HttpError("No hay suficiente stock disponible.", 400));
      }

      // Recalcular el precio total del carrito
      const precioOriginal = producto.precio * productoEnCarrito.cantidad;
      carrito.precioTotal += producto.precio * cantidad - precioOriginal;
      productoEnCarrito.cantidad = cantidad;
    }

    await carrito.save();
    res.status(200).json(carrito);
  } catch (error) {
    return next(
      new HttpError(
        "No se pudo actualizar la cantidad de los productos en el carrito.",
        500
      )
    );
  }
};


// Borrar un producto del carrito de compra
const borrarProducto = async (req, res, next) => {
  const { carritoId, productoId } = req.params;

  try {
    const carrito = await Carrito.findById(carritoId);

    if (!carrito) {
      return next(new HttpError("Carrito no encontrado.", 404));
    }

    const productoEnCarritoIndex = carrito.productos.findIndex(
      (p) => p.producto.toString() === productoId
    );

    if (productoEnCarritoIndex === -1) {
      return next(new HttpError("Producto no encontrado en el carrito.", 404));
    }

    const producto = await Producto.findById(
      carrito.productos[productoEnCarritoIndex].producto
    );

    if (!producto) {
      return next(new HttpError("Producto no encontrado.", 404));
    }

    carrito.precioTotal -=
      producto.precio * carrito.productos[productoEnCarritoIndex].cantidad;

    // Formatea el precio total a 2 decimales
    carrito.precioTotal = carrito.precioTotal.toFixed(2);
    carrito.productos.splice(productoEnCarritoIndex, 1);

    await carrito.save();
    res.status(200).json(carrito);
  } catch (error) {
    return next(
      new HttpError("No se pudo borrar el producto del carrito.", 500)
    );
  }
};

// Borrar un carrito de compra completo
const borrarCarrito = async (req, res, next) => {
  const { carritoId } = req.params;

  try {
    const carrito = await Carrito.findByIdAndRemove(carritoId);

    if (!carrito) {
      return next(new HttpError("Carrito no encontrado.", 404));
    }

    res.status(200).json({ message: "Carrito eliminado." });
  } catch (error) {
    return next(new HttpError("No se pudo borrar el carrito de compra.", 500));
  }
};

module.exports = {
  crearCarrito,
  agregarProducto,
  actualizarProducto,
  borrarProducto,
  borrarCarrito,
  crearCarritoProductos,
  actualizarProductosEnCarrito,
};
