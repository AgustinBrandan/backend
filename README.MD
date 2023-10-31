# Backend de Aplicación de E-Commerce

## Tecnologías Utilizadas

- **Express.js**: Framework de servidor web para la creación de endpoints y manejo de solicitudes HTTP.
- **MongoDB**: Base de datos NoSQL para almacenar información de productos, categorías y órdenes de compra.

## Casos de Uso

Esta aplicación de e-commerce ofrece las siguientes funcionalidades:

### Productos

- **Crear una entidad que sea utilizable en una aplicación de tipo e-commerce.**
- **Endpoints a generar:**
- **Listar todos los productos:** `GET /api/productos`
- **Obtener un producto por su ID:** `GET /api/productos/{id}`
- **Listar productos por categoría:** `GET /api/productos/categoria/{nombreCategoria}`
- **Crear un nuevo producto:** `POST /api/productos`
- **Actualizar un producto por su ID:** `PATCH /api/productos/{pid}`
- **Borrar un producto por su ID:** `DELETE /api/productos/{id}`

**Observaciones:**
- La categoría no es obligatoria, por lo que puede haber productos categorizados y no categorizados.

### Categorías

- **Crear entidad que sirve para categorizar los productos.**
- **Endpoints a generar:**
- **Listar todas las categorías:** `GET /api/categorias`
- **Obtener una categoría por su ID:** `GET /api/categorias/{cid}`
- **Crear una nueva categoría:** `POST /api/categorias`
- **Actualizar una categoría por su ID:** `PATCH /api/categorias/{cid}`
- **Borrar una categoría por su ID:** `DELETE /api/categorias/{cid}`

**Observaciones:**
- Si alguna categoría sufre alguna modificación, esta debe ser reflejada en los productos asociados.

### Orden de Compra

- **Crear entidad para coleccionar productos en un formato de orden de compra o carrito de compra.**
- **Endpoints a generar:**

- **Crear un carrito de compra:** `POST /api/carrito`
- **Agregar un producto al carrito de compra:** `POST /api/carrito/{carritoId}/productos`
- **Actualizar la cantidad de un producto en el carrito:** `PATCH /api/carrito/{carritoId}/producto/{productoId}`
- **Borrar un producto del carrito de compra:** `DELETE /api/carrito/{carritoId}/producto/{productoId}`
- **Borrar un carrito de compra completo:** `DELETE /api/carrito/{carritoId}`


