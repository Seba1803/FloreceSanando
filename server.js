// filepath: /c:/Users/sebas/OneDrive/Escritorio/FloreceSanando/server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Configurar body-parser
app.use(bodyParser.json());

// Conectar a la base de datos SQLite
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos SQLite');
    }
});

// Crear tabla de pacientes si no existe
db.run(`CREATE TABLE IF NOT EXISTS pacientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreCompleto TEXT,
    rut TEXT,
    genero TEXT,
    edad INTEGER,
    fechaNacimiento TEXT,
    diagnosticoIngreso TEXT,
    nacionalidad TEXT,
    email TEXT,
    estadoCivil TEXT,
    observacionInicial TEXT
)`);

// Ruta para guardar un nuevo paciente
app.post('/api/pacientes', (req, res) => {
    const { nombreCompleto, rut, genero, edad, fechaNacimiento, diagnosticoIngreso, nacionalidad, email, estadoCivil, observacionInicial } = req.body;
    db.run(`INSERT INTO pacientes (nombreCompleto, rut, genero, edad, fechaNacimiento, diagnosticoIngreso, nacionalidad, email, estadoCivil, observacionInicial) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [nombreCompleto, rut, genero, edad, fechaNacimiento, diagnosticoIngreso, nacionalidad, email, estadoCivil, observacionInicial],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(201).json({ id: this.lastID });
            }
        });
});

// Ruta para obtener todos los pacientes
app.get('/api/pacientes', (req, res) => {
    db.all('SELECT * FROM pacientes', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});