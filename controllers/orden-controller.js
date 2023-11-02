const Carrito = require("../models/carrito");
const OrdenCompra = require("../models/ordenCompra");
const Producto = require("../models/producto");


const HttpError = require("../models/http.error");

// Generar una orden de compra basada en un carrito
const generarOrdenCompra = async (req, res, next) => {
  const { carritoId } = req.params; 
  const { clienteEmail, clienteDireccion } = req.body; 

  try {
    const carrito = await Carrito.findById(carritoId);

    if (!carrito) {
      return next(new HttpError("Carrito no encontrado.", 404));
    }

    const ordenCompra = new OrdenCompra({
      carrito: carrito._id,
      clienteEmail,
      clienteDireccion,
      pagado: false,
    });

    ordenCompra.productos = carrito.productos;
    ordenCompra.precioTotal = carrito.precioTotal;

    await ordenCompra.save();


    res.status(201).json(ordenCompra);
  } catch (error) {
    return next(new HttpError("No se pudo generar la orden de compra.", 500));
  }
};

const realizarPago = async (req, res, next) => {
    const { ordenId } = req.params; 
  
    try {
      const orden = await OrdenCompra.findById(ordenId);
  
      if (!orden) {
        return next(new HttpError("Orden de compra no encontrada.", 404));
      }
  
      // Verificar si la orden no ha sido pagada previamente
      if (orden.pagado) {
        return next(new HttpError("La orden de compra ya ha sido pagada.", 400));
      }
  
      // Obtener el carrito asociado a la orden
      const carrito = await Carrito.findById(orden.carrito);
  
      if (!carrito) {
        return next(new HttpError("Carrito no encontrado.", 404));
      }
  
      // Cambiar el estado de pago de la orden
      orden.pagado = true;
      await orden.save();
  
      // Para cada producto en el carrito, reduce la cantidad en stock
      for (const item of carrito.productos) {
        const producto = await Producto.findById(item.producto);
        if (producto) {
          // Resta la cantidad de productos comprados del stock actual
          producto.cantidad -= item.cantidad;
          await producto.save();
        }
      }
  
      // Eliminar el carrito después de que la orden se marque como pagada
      await Carrito.findByIdAndRemove(carrito._id);
  
      res.status(200).json({ message: "Pago de la orden realizado con éxito" });
    } catch (error) {
      return next(new HttpError("No se pudo procesar el pago de la orden.", 500));
    }
  };

// Obtener todas las órdenes de compra no pagadas
const obtenerOrdenesNoPagadas = async (req, res, next) => {
  try {
    const ordenesNoPagadas = await OrdenCompra.find({ pagado: false });

    res.status(200).json(ordenesNoPagadas);
  } catch (error) {
    return next(
      new HttpError(
        "No se pudieron obtener las órdenes de compra no pagadas.",
        500
      )
    );
  }
};

// Obtener todas las órdenes de compra pagadas
const obtenerOrdenesPagadas = async (req, res, next) => {
  try {
    const ordenesPagadas = await OrdenCompra.find({ pagado: true });

    res.status(200).json(ordenesPagadas);
  } catch (error) {
    return next(
      new HttpError(
        "No se pudieron obtener las órdenes de compra pagadas.",
        500
      )
    );
  }
};

module.exports = {
  generarOrdenCompra,
  realizarPago,
  obtenerOrdenesNoPagadas,
  obtenerOrdenesPagadas,
};
