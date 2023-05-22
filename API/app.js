const express = require('express');

const app = express();

//Filtro con el formato filtro1&filtro2&filtro3...&filtroN. Rango con formato a&b (páginas a y b incluidas)
app.get('/api/catalogo/:filter/:range', (req, res) => {
    const filtros = req.params.filter.split('&');
    const rango_paginas = req.params.range.split('&');
    //Consulta SQL
    res.send('Filtro: ' + filtros + "\nRango: " + rango_paginas);
});

app.get('/api/busqueda/:searchtext', (req, res) => {
    const texto_busqueda = req.params.searchtext;
    //Consulta SQL
    res.send('Busqueda: ' + texto_busqueda);
});

app.post('/api/newuser', (req, res) => {
    const { name, email, password, newpassword } = req.body;
    const newUser = {
        name,
        email,
        password,
        newpassword
    };
    if (password == newpassword) {
        //Buscar si name existe en la BBDD, en caso de que no, proseguir.
    }
    //Consulta SQL para guardar datos (incluye verificar si el email no está registrado)
    res.send('Usuario creado');
});

app.post('/api/log', (req, res) => {
    const { email, password } = req.body;
    const User = {
        email,
        password
    };
    //Consulta SQL para realizar la lógica de verificación
});

app.listen(3000, () => {
    console.log("El servidor está escuchando en http://localhost:3000/");
});