const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser"); // Don't forget to install it using npm install body-parser

const path = require("path");
const {
  query,
  addProduct,
  removeProduct,
  searchProducts,
  searchProductsByNameOrDescription,
  userLogin,
  createUser,
  updateUser,
  addToCart,
  getCotizations,
  updateRecipe,
  getUsuarios,
  getProductos,
  getCarritoComprasByUser,
  getComprasByUser,
  getInventario,
  getPromociones,
  getResenasByUser,
  getNotificacionesByUser,
  getMetodoPagoByUser,
  getContactoByUser,
  getHistorialComprasByUser,
  getBusquedaProductoByUser,
  getListaDeseosByUser,
} = require("../database/database");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..")));

// Route handlers
app.get("/", (req, res) => {
  if (req.session == undefined || req.session.usuario == undefined) {
    req.session = false;
    req.session.usuario = false;
  }
  res.render("index", {
    header: "partials/header",
    session: req.session,
    isUserLoggedIn: req.session && req.session.usuario,
  });
});

app.get("/productos", (req, res) => {
  if (req.session == undefined || req.session.usuario == undefined) {
    req.session = false;
    req.session.usuario = false;
  }
  res.render("productos", {
    header: "partials/header",
    session: req.session,
    isUserLoggedIn: req.session && req.session.usuario,
  });
});

app.get("/carrito", (req, res) => {
  if (req.session == undefined || req.session.usuario == undefined) {
    req.session = false;
    req.session.usuario = false;
  }
  res.render("carrito", {
    header: "partials/header",
    session: req.session,
    isUserLoggedIn: req.session && req.session.usuario,
  });
});

app.get("/perfil", (req, res) => {
  if (req.session == undefined || req.session.usuario == undefined) {
    req.session = false;
    req.session.usuario = false;
  }
  res.render("perfil", {
    header: "partials/header",
    session: req.session,
    isUserLoggedIn: req.session && req.session.usuario,
    usuario: req.session.usuario,
  });
});
app.get("/admin", async (req, res) => {
  if (req.session == undefined || req.session.usuario == undefined) {
    req.session = false;
    req.session.usuario = false;
  }
  const { tipo_lente, color, marca } = req.query;
  try {
    const result = await searchProducts(tipo_lente, color, marca);
    res.render("admin", {
      header: "partials/header",
      session: req.session,
      isUserLoggedIn: req.session && req.session.usuario,
      usuario: req.session.usuario,
      productos: result,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al buscar productos" });
  }
});
app.get("/receta", (req, res) => {
  if (req.session == undefined || req.session.usuario == undefined) {
    req.session = false;
    req.session.usuario = false;
  }
  res.render("receta", {
    header: "partials/header",
    session: req.session,
    isUserLoggedIn: req.session && req.session.usuario,
  });
});

app.get("/login", (req, res) => {
  if (req.session == undefined || req.session.usuario == undefined) {
    req.session = false;
    req.session.usuario = false;
  }
  res.render("login", {
    header: "partials/header",
    session: req.session,
    isUserLoggedIn: req.session && req.session.usuario,
  });
});

app.get("/registro", (req, res) => {
  if (req.session == undefined || req.session.usuario == undefined) {
    req.session = false;
    req.session.usuario = false;
  }
  res.render("registro", {
    header: "partials/header",
    session: req.session,
    isUserLoggedIn: req.session && req.session.usuario,
  });
});
app.get("/logout", (req, res) => {
  // Clear the user session
  req.session.usuario = null;

  // Redirect to the login page or any other desired page
  res.redirect("/login");
});

app.get("/api/productos", async (req, res) => {
  const { tipo_lente, color, marca } = req.query;
  try {
    const result = await searchProducts(tipo_lente, color, marca);
    res.json(result);
  } catch (error) {
    console.error("Error al buscar productos:", error);
    res.status(500).json({ mensaje: "Error al buscar productos" });
  }
});

app.get("/api/productos/buscar", async (req, res) => {
  const { q } = req.query;
  try {
    const result = await searchProductsByNameOrDescription(q);
    res.json(result);
  } catch (error) {
    console.error("Error al buscar productos:", error);
    res.status(500).json({ mensaje: "Error al buscar productos" });
  }
});

app.post("/api/productos/agregar", async (req, res) => {
  const {
    nombre_producto,
    descripcion,
    tipo_lente,
    color,
    marca,
    precio,
    image_url,
  } = req.body;

  try {
    const newProduct = await addProduct(
      nombre_producto,
      descripcion,
      tipo_lente,
      color,
      marca,
      precio,
      image_url
    );
    res.json({
      mensaje: "Producto agregado exitosamente!",
      producto: newProduct,
    });
  } catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(500).json({ mensaje: "Error al agregar producto" });
  }
});

app.delete("/api/productos/eliminar/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const removedProduct = await removeProduct(id);
    if (!removedProduct) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.json({
      mensaje: "Producto eliminado exitosamente!",
      producto: removedProduct,
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ mensaje: "Error al eliminar producto" });
  }
});

app.post("/api/usuarios/login", async (req, res) => {
  const { email, contrasena } = req.body;
  console.log(req.body);
  try {
    const result = await userLogin(email, contrasena);
    if (result[0] == null) {
      res.status(401).json({ mensaje: "Credenciales inválidas" });
    } else {
      req.session.usuario = result[0]; // Store the user in the session
      res.json({ mensaje: "Inicio de sesión exitoso", usuario: result[0] });
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ mensaje: "Error al iniciar sesión" });
  }
});

app.post("/api/usuarios/register", async (req, res) => {
  const {
    nombre_usuario,
    email,
    contrasena,
    tipo_usuario,
    nombre,
    apellido,
    telefono,
  } = req.body;
  console.log("req:", {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
  });
  try {
    const result = await query("SELECT id FROM Usuarios WHERE email = $1;", [
      email,
    ]);
    if (result[0] == null) {
      await query(
        "INSERT INTO Usuarios (nombre_usuario, tipo_usuario, contrasena, email, nombre, apellido) VALUES ($1, $2, $3, $4, $5, $6)",
        [nombre_usuario, tipo_usuario, contrasena, email, nombre, apellido]
      );

      res.json({ mensaje: "Registro exitoso" });
    } else {
      res
        .status(400)
        .json({ mensaje: "Ya existe una cuenta registrada con este correo." });
    }
  } catch (error) {
    console.error("Error al registrar (1):", error);
    res.status(500).json({ mensaje: "Error al registrar (1)" });
  }
});

app.put("/api/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nombre_usuario,
    tipo_usuario,
    contrasena,
    email,
    nombre,
    apellido,
    telefono,
  } = req.body;
  try {
    await updateUser(
      id,
      nombre_usuario,
      tipo_usuario,
      contrasena,
      email,
      nombre,
      apellido,
      telefono
    );
    res.json({ mensaje: "Perfil actualizado correctamente" });
  } catch (error) {
    console.error("Error al modificar el perfil:", error);
    res.status(500).json({ mensaje: "Error al modificar el perfil" });
  }
});

app.post("/api/carrito", async (req, res) => {
  const { id_usuario, id_producto } = req.body;
  try {
    await addToCart(id_usuario, id_producto);
    res.json({ mensaje: "Producto agregado al carrito" });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).json({ mensaje: "Error al agregar producto al carrito" });
  }
});

app.get("/api/usuarios/:id/cotizaciones", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await getCotizations(id);
    res.json(result);
  } catch (error) {
    console.error("Error al obtener las cotizaciones:", error);
    res.status(500).json({ mensaje: "Error al obtener las cotizaciones" });
  }
});

app.post("/api/usuarios/:id/receta", async (req, res) => {
  const { id } = req.params;
  const { receta } = req.body;
  try {
    await attachPrescription(id, receta);
    res.json({ mensaje: "Receta adjuntada correctamente" });
  } catch (error) {
    console.error("Error al adjuntar la receta:", error);
    res.status(500).json({ mensaje: "Error al adjuntar la receta" });
  }
});

app.listen(3000, () => {
  console.log("Servidor escuchando en el puerto 3000");
});
