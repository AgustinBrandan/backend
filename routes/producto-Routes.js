const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const productoController = require("../controllers/producto-controller");

// Definir rutas
router.get("/", productoController.listarProductos);

router.get("/:id", productoController.obtenerProductoPorId);

router.get("/categoria/:categoria", productoController.listarProductosPorCategoria);

router.post(
  "/",
  [
    check("nombre").not().isEmpty(),
    check("precio").isNumeric(),
    check("descripcion").isLength({ min: 5 }),
  ],
  productoController.crearProducto
);

router.patch(
  "/:pid",
  [
    check("precio").notEmpty().isFloat(),
    check("cantidad").notEmpty().isFloat(),
  ],
  productoController.actualizarProducto
);

router.delete("/:id", productoController.borrarProducto);

module.exports = router;
