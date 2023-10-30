const express = require("express");
const router = express.Router();
const categoriaController = require("../controllers/categoria-controller");
const { check } = require("express-validator");

// Listar todas las categorías
router.get("/", categoriaController.listarCategorias);

// Listar una categoría por su ID
router.get("/:cid", categoriaController.getCategoriaPorId);

// Crear una nueva categoría

router.post(
    "/",
    [
      check("nombre").not().isEmpty()
    ],
    categoriaController.crearCategoria
  );

// Actualizar una categoría por su ID
router.patch("/:cid", categoriaController.actualizarCategoria);

// Borrar una categoría por su ID
router.delete("/:cid", categoriaController.borrarCategoria);

module.exports = router;
