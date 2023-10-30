const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  descripcion: String,
  cantidad: Number,
  categoria: { 
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Categoria',
  },
});

module.exports  = mongoose.model('Producto', productoSchema);


