import React, { useState, useEffect } from 'react';
import './App.css'; // Asegúrate de que este archivo CSS exista o adáptalo a tu gusto

function App() {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [telefonoContacto, setTelefonoContacto] = useState('');
  const [tratamientoRequerido, setTratamientoRequerido] = useState('');
  const [observacionesAdicionales, setObservacionesAdicionales] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const [message, setMessage] = useState(''); // Para mostrar mensajes de éxito/error

  // URL de tu API de backend para pacientes (asegúrate de que el puerto sea el mismo que el de tu backend)
  const API_URL = 'http://localhost:5000/api/pacientes';

  // useEffect para cargar los pacientes al inicio de la aplicación
  useEffect(() => {
    fetchPacientes();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

  // Función para obtener la lista de pacientes del backend
  const fetchPacientes = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPacientes(data);
    } catch (error) {
      console.error("Error fetching pacientes:", error);
      setMessage("Error al cargar los pacientes.");
    }
  };

  // Función para manejar el envío del formulario de registro de pacientes
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página)

    const nuevoPaciente = {
      nombreCompleto,
      telefonoContacto,
      tratamientoRequerido,
      observacionesAdicionales
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Importante para enviar JSON
        },
        body: JSON.stringify(nuevoPaciente), // Convierte el objeto JavaScript a una cadena JSON
      });

      if (!response.ok) {
        // Si el servidor devuelve un error HTTP (ej. 400 Bad Request)
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessage(data.message); // Muestra el mensaje de éxito del backend

      // Limpia los campos del formulario
      setNombreCompleto('');
      setTelefonoContacto('');
      setTratamientoRequerido('');
      setObservacionesAdicionales('');

      fetchPacientes(); // Refresca la lista de pacientes para mostrar el nuevo
    } catch (error) {
      console.error("Error registrando paciente:", error);
      setMessage(`Error al registrar el paciente: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <h1>Gestión de Pacientes para Consultorio Dental</h1>

      <section>
        <h2>Registrar Nuevo Paciente</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nombreCompleto">Nombre Completo:</label>
            <input
              type="text"
              id="nombreCompleto"
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="telefonoContacto">Teléfono de Contacto:</label>
            <input
              type="text"
              id="telefonoContacto"
              value={telefonoContacto}
              onChange={(e) => setTelefonoContacto(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="tratamientoRequerido">Tratamiento Requerido:</label>
            <input
              type="text"
              id="tratamientoRequerido"
              value={tratamientoRequerido}
              onChange={(e) => setTratamientoRequerido(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="observacionesAdicionales">Observaciones Adicionales:</label>
            <textarea
              id="observacionesAdicionales"
              value={observacionesAdicionales}
              onChange={(e) => setObservacionesAdicionales(e.target.value)}
              rows="3"
            ></textarea>
          </div>
          <button type="submit">Registrar Paciente</button>
        </form>
        {/* Muestra mensajes de feedback al usuario */}
        {message && <p className={message.includes("Error") ? "error-message" : "success-message"}>{message}</p>}
      </section>

      <section>
        <h2>Pacientes Registrados</h2>
        {pacientes.length === 0 ? (
          <p>No hay pacientes registrados.</p>
        ) : (
          <ul>
            {pacientes.map((paciente) => (
              <li key={paciente.id}>
                <strong>Nombre:</strong> {paciente.nombreCompleto},
                <strong> Teléfono:</strong> {paciente.telefonoContacto},
                <strong> Tratamiento:</strong> {paciente.tratamientoRequerido}
                {paciente.observacionesAdicionales && `, Observaciones: ${paciente.observacionesAdicionales}`}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;