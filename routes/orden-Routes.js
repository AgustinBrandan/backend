const express = require("express");
const router = express.Router();
const ordenCompraController = require("../controllers/orden-controller");

// Ruta para generar una orden de compra
router.post("/generar/:carritoId", ordenCompraController.generarOrdenCompra);
// Ruta para obtener todas las órdenes de compra pagadas
router.get("/pagadas", ordenCompraController.obtenerOrdenesPagadas);

// Ruta para obtener todas las órdenes de compra no pagadas
router.get("/nopagadas", ordenCompraController.obtenerOrdenesNoPagadas);

// Ruta para realizar un pago y actualizar el estado de una orden de compra específica
router.post("/pagar/:ordenId", ordenCompraController.realizarPago);

module.exports = router;
