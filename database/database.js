const pg = require("pg");

const pool = new pg.Pool({
  user: "turyvzwx",
  host: "rajje.db.elephantsql.com",
  database: "turyvzwx",
  password: "L1hFyXi3D7btq3Js7T5PJojIa9X-hRBA",
  port: 5432, // ElephantSQL uses port 5432 by default
});

// Query function for generic queries
const query = (queryString, values) => {
  return new Promise((resolve, reject) => {
    pool.query(queryString, values, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.rows);
      }
    });
  });
};

// Functions for querying specific tables
const getUsuarios = () => query("SELECT * FROM Usuarios;");
const getProductos = () => query("SELECT * FROM Productos;");
const getCarritoComprasByUser = (userId) =>
  query(
    "SELECT p.* FROM carritocompras cc JOIN productos p ON cc.id_producto = p.id WHERE cc.id_usuario = $1;",
    [userId]
  );
const getComprasByUser = (userId) =>
  query("SELECT * FROM Compras WHERE id_usuario = $1;", [userId]);
const getInventario = () => query("SELECT * FROM Inventario;");
const getInventarioProducto = (productId) => {
  return query("SELECT * FROM Inventario WHERE id_producto = $1;", [productId]);
};
const setInventarioProducto = async (productId, quantity) => {
  // First, try to update the quantity for productId
  const updateResult = await query(
    "UPDATE Inventario SET cantidad = $1 WHERE id_producto = $2;",
    [quantity, productId]
  );

  // If no rows were updated, then productId doesn't exist in the Inventario table
  // In this case, insert a new row for productId with the given quantity
  if (updateResult.rowCount === 0) {
    await query(
      "INSERT INTO Inventario (id_producto, cantidad) VALUES ($1, $2);",
      [productId, quantity]
    );
  }
};

const getPromociones = () => query("SELECT * FROM Promociones;");
const getResenasByUser = (userId) =>
  query("SELECT * FROM Resenas WHERE id_usuario = $1;", [userId]);
const getNotificacionesByUser = (userId) =>
  query("SELECT * FROM Notificaciones WHERE id_usuario = $1;", [userId]);
const getMetodoPagoByUser = (userId) =>
  query("SELECT * FROM MetodoPago WHERE id_usuario = $1;", [userId]);
const getContactoByUser = (userId) =>
  query("SELECT * FROM Contacto WHERE id_usuario = $1;", [userId]);
const getHistorialComprasByUser = (userId) =>
  query("SELECT * FROM HistorialCompras WHERE id_usuario = $1;", [userId]);
const getBusquedaProductoByUser = (userId) =>
  query("SELECT * FROM BusquedaProducto WHERE id_usuario = $1;", [userId]);
const getListaDeseosByUser = (userId) =>
  query("SELECT * FROM ListaDeseos WHERE id_usuario = $1;", [userId]);

const addProduct = (
  nombre_producto,
  descripcion,
  tipo_lente,
  color,
  marca,
  precio,
  image_url
) => {
  return query(
    "INSERT INTO Productos (nombre_producto, descripcion, tipo_lente, color, marca, precio, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [nombre_producto, descripcion, tipo_lente, color, marca, precio, image_url]
  ).then((result) => result[0]);
};

const removeProduct = (id) => {
  return query("DELETE FROM Productos WHERE id = $1 RETURNING *", [id]).then(
    (result) => result[0]
  );
};

const searchProducts = (tipo_lente, color, marca) => {
  let queryString;
  let values;
  if (!tipo_lente || !color || !marca) {
    queryString = "SELECT * FROM Productos";
  } else {
    queryString =
      "SELECT * FROM Productos WHERE tipo_lente = $1 AND color = $2 AND marca = $3";
    values = [tipo_lente, color, marca];
  }
  return query(queryString, values);
};

const searchProductsByNameOrDescription = (q) => {
  return query(
    "SELECT * FROM Productos WHERE nombre_producto ILIKE $1 OR descripcion ILIKE $1",
    [`%${q}%`]
  );
};

const userLogin = (email, contrasena) => {
  return query("SELECT * FROM Usuarios WHERE email = $1 AND contrasena = $2", [
    email,
    contrasena,
  ]);
};

const updateUser = (
  id,
  nombre_usuario,
  tipo_usuario,
  contrasena,
  email,
  nombre,
  apellido,
  telefono
) => {
  return query(
    "UPDATE Usuarios SET nombre_usuario = $1, tipo_usuario = $2, contrasena = $3, email = $4, nombre = $5, apellido = $6, telefono = $7 WHERE id = $8",
    [
      nombre_usuario,
      tipo_usuario,
      contrasena,
      email,
      nombre,
      apellido,
      telefono,
      id,
    ]
  );
};

const createUser = (
  nombre_usuario,
  tipo_usuario,
  contrasena,
  email,
  nombre,
  apellido,
  telefono
) => {
  return query(
    "INSERT INTO Usuarios (nombre_usuario, tipo_usuario, contrasena, email, nombre, apellido, telefono) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [
      nombre_usuario,
      tipo_usuario,
      contrasena,
      email,
      nombre,
      apellido,
      telefono,
    ]
  ).then((result) => result[0]);
};

const addToCart = (id_usuario, id_producto) => {
  return query(
    "INSERT INTO CarritoCompras (id_usuario, id_producto) VALUES ($1, $2)",
    [id_usuario, id_producto]
  );
};

const removeFromCart = (id_usuario, id_producto) => {
  return query(
    "DELETE FROM CarritoCompras WHERE id_usuario = $1 AND id_producto = $2",
    [id_usuario, id_producto]
  );
};

const addReceta = (id_usuario, ruta_pdf, fecha_subida) => {
  return query(
    "INSERT INTO Recetas (id_usuario, ruta_pdf, fecha_subida) VALUES ($1, $2, $3) RETURNING *",
    [id_usuario, ruta_pdf, fecha_subida]
  ).then((result) => result[0]);
};

// Remove recipe
const removeReceta = (id) => {
  return query("DELETE FROM Recetas WHERE id = $1 RETURNING *", [id]).then(
    (result) => result[0]
  );
};

// Search for recipes by user
const buscarRecetasPorUsuario = (id_usuario) => {
  return query("SELECT * FROM Recetas WHERE id_usuario = $1;", [id_usuario]);
};

module.exports = {
  query,
  addProduct,
  removeProduct,
  searchProducts,
  searchProductsByNameOrDescription,
  userLogin,
  createUser,
  updateUser,
  addToCart,
  removeFromCart,
  getUsuarios,
  getProductos,
  getCarritoComprasByUser,
  getComprasByUser,
  getInventario,
  getInventarioProducto,
  setInventarioProducto,
  getPromociones,
  getResenasByUser,
  getNotificacionesByUser,
  getMetodoPagoByUser,
  getContactoByUser,
  getHistorialComprasByUser,
  getBusquedaProductoByUser,
  getListaDeseosByUser,
  addReceta,
  removeReceta,
  buscarRecetasPorUsuario,
};
