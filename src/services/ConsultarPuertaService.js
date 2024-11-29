// Importación de dependencias necesarias
import axios from "axios"; // Biblioteca para realizar solicitudes HTTP
import { BASE_URL } from "@env"; // URL base configurada en las variables de entorno

/**
 * Función para consultar la puerta asignada a un contenedor.
 * @param {string} token - Token de autenticación del usuario.
 * @param {string} idContenedor - ID del contenedor para consultar la puerta.
 * @returns {Promise<Object>} - Respuesta del servidor con la información de la puerta.
 * @throws {Error} - Lanza un error si la solicitud falla.
 */
export const consultarPuerta = async (token, idContenedor) => {
  try {
    // Realizar una solicitud HTTP GET al servidor
    const response = await axios.get(
      `${BASE_URL}/puertacontenedor/consultarPuerta/${idContenedor}`, // Endpoint para consultar la puerta asignada
      {
        headers: {
          Authorization: `Token ${token}`, // Encabezado de autenticación con el token del usuario
        },
      }
    );

    // Devolver los datos de la respuesta si la solicitud fue exitosa
    return response.data;
  } catch (error) {
    // Manejo de errores: log en consola con detalles del error
    console.error(
      "Error en consultarPuerta:",
      error.response?.data || error.message // Mostrar detalles de la respuesta del servidor o mensaje genérico de error
    );
    throw error; // Propagar el error para que pueda ser manejado por el llamador
  }
};
