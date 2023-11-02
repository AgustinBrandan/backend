const mongoose = require("mongoose");

const ordenCompraSchema = new mongoose.Schema({
  carrito: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carrito",
    required: true,
  },
  clienteEmail: {
    type: String,
    required: true,
  },
  clienteDireccion: {
    type: String,
    required: true,
  },
  pagado: {
    type: Boolean,
    default: false, 
  },

});

const OrdenCompra = mongoose.model("OrdenCompra", ordenCompraSchema);

module.exports = OrdenCompra;