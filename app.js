const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// Error
const HttpError = require("./models/http.error");

// Rutas
const productoRoutes = require("./routes/producto-Routes");
const categoriaRoutes = require("./routes/categoria-Routes");
const carritoRoutes = require("./routes/carrito-Routes");



const app = express();

app.use(bodyParser.json());


app.use("/api/productos", productoRoutes); 
app.use("/api/categorias", categoriaRoutes); 
app.use("/api/carrito", carritoRoutes); 

// Manejo rutas no definidas
app.use((req, res, next) => {
    throw new HttpError("Esta Ruta no existe", 404);
  });
// Middleware de manejo de errores
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({ error: err.message || "Error desconocido" });
});




const mongoURL =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gh2t0ok.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// Conexión a la base de datos
mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(5000);
    console.log("Conexión a la base de datos establecida");
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
  });

// i
