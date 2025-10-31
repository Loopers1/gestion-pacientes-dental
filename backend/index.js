// backend/index.js - Para Ejercicio 2: Gestión de Pacientes para Consultorio Dental
const express = require('express');
const cors = require('cors');
const app = express(); // <-- ¡Asegúrate de que esta línea esté presente!
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Permite a Express parsear JSON en el body de las peticiones

// **Aquí irán tus datos/base de datos simple**
let pacientes = [];

// Rutas API para el Ejercicio 2 (Sistema de Gestión de Pacientes)
// 1. Registrar pacientes
app.post('/api/pacientes', (req, res) => {
    const { nombreCompleto, telefonoContacto, tratamientoRequerido, observacionesAdicionales } = req.body;

    // Validación básica
    if (!nombreCompleto || !telefonoContacto || !tratamientoRequerido) {
        return res.status(400).json({ message: 'Nombre, teléfono y tratamiento son obligatorios.' });
    }

    const nuevoPaciente = {
        id: pacientes.length > 0 ? Math.max(...pacientes.map(p => p.id)) + 1 : 1, // ID simple
        nombreCompleto,
        telefonoContacto,
        tratamientoRequerido,
        observacionesAdicionales: observacionesAdicionales || '' // Las observaciones pueden ser opcionales
    };
    pacientes.push(nuevoPaciente);
    res.status(201).json({ message: 'Paciente registrado con éxito', paciente: nuevoPaciente });
});

// 2. Visualizar todos los pacientes
app.get('/api/pacientes', (req, res) => {
    res.status(200).json(pacientes);
});

// Puedes agregar un endpoint simple para probar que el servidor funciona
app.get('/', (req, res) => {
    res.send('API de Pacientes para Consultorio Dental funcionando correctamente!');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor backend de Pacientes corriendo en http://localhost:${PORT}`);
});