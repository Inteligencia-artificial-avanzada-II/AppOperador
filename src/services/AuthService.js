// Importación de dependencias necesarias
import axios from "axios"; // Biblioteca para realizar solicitudes HTTP
import { BASE_URL } from "@env"; // URL base configurada en variables de entorno

/**
 * Función para iniciar sesión y autenticar al usuario del contenedor.
 * @param {string} email - Correo electrónico del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Promise<Object>} - Respuesta del servidor con los datos de autenticación.
 * @throws {Error} - Lanza un error si la solicitud falla.
 */
export const loginContenedor = async (email, password) => {
  try {
    // Realizar una solicitud HTTP POST al servidor
    const response = await axios.post(
      `${BASE_URL}/contenedor/login`, // Endpoint para iniciar sesión
      {
        userName: email, // Correo electrónico del usuario
        contraseña: password, // Contraseña del usuario
      }
    );

    // Devolver los datos de la respuesta si la solicitud fue exitosa
    return response.data;
  } catch (error) {
    // Manejo de errores: log en consola con detalles del error
    console.error("Error en loginContenedor:", error.response?.data || error.message);
    throw error; // Propagar el error para que pueda ser manejado por el llamador
  }
};
