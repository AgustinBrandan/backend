const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carrito-controller');


// Crear un carrito de compra
router.post('/', carritoController.crearCarrito);

// Agregar un producto al carrito de compra
router.post('/:carritoId/productos', carritoController.agregarProducto);

// Actualizar la cantidad de un producto en el carrito de compra
router.patch('/:carritoId/productos/:productoId', carritoController.actualizarProducto);

// Borrar un producto del carrito de compra
router.delete('/:carritoId/productos/:productoId', carritoController.borrarProducto);

// Borrar un carrito de compra completo
router.delete('/:carritoId', carritoController.borrarCarrito);

module.exports = router;
