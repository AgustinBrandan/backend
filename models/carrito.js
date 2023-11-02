const mongoose = require("mongoose");

const carritoSchema = new mongoose.Schema({
  productos: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Producto",
      },
      cantidad: Number,
    },
  ],
  precioTotal: Number,
});

module.exports = mongoose.model("Carrito", carritoSchema);
