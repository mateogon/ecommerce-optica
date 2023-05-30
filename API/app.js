const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

// Configuración de la conexión a la base de datos PostgreSQL
const pool = new pg.Pool({
    user: "postgres",
    host: "localhost",
    database: "optica",
    password: "password",
    port: 5432,
});

const app = express();
const path = require('path');
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Ruta para buscar productos por tipo de lente, tamaño, color y marca
app.get('/productos', (req, res) => {
  const { tipo_lente, color, marca } = req.query;
  console.log(tipo_lente, color, marca);
  let query = null;
  if (tipo_lente == null || color == null || marca == null) {
    query = {
      text: 'SELECT * FROM Productos'
    };
  }
  else {
    query = {
      text: 'SELECT * FROM Productos WHERE tipo_lente = $1 AND color = $2 AND marca = $3',
      values: [tipo_lente, color, marca],
    };
  }

  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error al buscar productos:', error);
      res.status(500).json({ mensaje: 'Error al buscar productos' });
    } else {
      console.log(result.rows);
      res.json(result.rows);
    }
  });
});

// Ruta para búsqueda específica a través de un buscador
app.get('/productos/buscar', (req, res) => {
  const { q } = req.query;
  const query = {
    text: 'SELECT * FROM Productos WHERE nombre_producto ILIKE $1 OR descripcion ILIKE $1',
    values: [`%${q}%`],
  };

  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error al buscar productos:', error);
      res.status(500).json({ mensaje: 'Error al buscar productos' });
    } else {
      res.json(result.rows);
    }
  });
});

// Ruta para inicio de sesión de un usuario
app.post('/usuarios/login', (req, res) => {
  const { nombre_usuario, contrasena } = req.body;
  const query = {
    text: 'SELECT * FROM Usuarios WHERE nombre_usuario = $1 AND contrasena = $2',
    values: [nombre_usuario, contrasena],
  };

  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ mensaje: 'Error al iniciar sesión' });
    } else if (result.rows.length === 0) {
      res.status(401).json({ mensaje: 'Credenciales inválidas' });
    } else {
      res.json({ mensaje: 'Inicio de sesión exitoso', usuario: result.rows[0] });
    }
  });
});

// Ruta para modificación del perfil de un usuario
app.put('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nombre_usuario, tipo_usuario, contrasena, email, informacion_contacto } = req.body;
  const query = {
    text: 'UPDATE Usuarios SET nombre_usuario = $1, tipo_usuario = $2, contrasena = $3, email = $4, informacion_contacto = $5 WHERE id = $6',
    values: [nombre_usuario, tipo_usuario, contrasena, email, informacion_contacto, id],
  };

  pool.query(query, (error) => {
    if (error) {
      console.error('Error al modificar el perfil:', error);
      res.status(500).json({ mensaje: 'Error al modificar el perfil' });
    } else {
      res.json({ mensaje: 'Perfil actualizado correctamente' });
    }
  });
});

// Ruta para agregar productos al carrito de compras
app.post('/carrito', (req, res) => {
  const { id_usuario, id_producto } = req.body;
  const query = {
    text: 'INSERT INTO CarritoCompras (id_usuario, id_producto) VALUES ($1, $2)',
    values: [id_usuario, id_producto],
  };

  pool.query(query, (error) => {
    if (error) {
      console.error('Error al agregar producto al carrito:', error);
      res.status(500).json({ mensaje: 'Error al agregar producto al carrito' });
    } else {
      res.json({ mensaje: 'Producto agregado al carrito' });
    }
  });
});

// Ruta para acceder a las cotizaciones guardadas por el usuario
app.get('/usuarios/:id/cotizaciones', (req, res) => {
  const { id } = req.params;
  const query = {
    text: 'SELECT * FROM Compras WHERE id_usuario = $1',
    values: [id],
  };

  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error al obtener las cotizaciones:', error);
      res.status(500).json({ mensaje: 'Error al obtener las cotizaciones' });
    } else {
      res.json(result.rows);
    }
  });
});

// Ruta para adjuntar la receta de lentes para cotizar
app.post('/usuarios/:id/receta', (req, res) => {
  const { id } = req.params;
  const { receta } = req.body;
  const query = {
    text: 'UPDATE Usuarios SET receta = $1 WHERE id = $2',
    values: [receta, id],
  };

  pool.query(query, (error) => {
    if (error) {
      console.error('Error al adjuntar la receta:', error);
      res.status(500).json({ mensaje: 'Error al adjuntar la receta' });
    } else {
      res.json({ mensaje: 'Receta adjuntada correctamente' });
    }
  });
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
