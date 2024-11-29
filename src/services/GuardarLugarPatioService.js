// Importación de dependencias necesarias
import axios from "axios"; // Biblioteca para realizar solicitudes HTTP
import { BASE_URL } from "@env"; // URL base configurada en las variables de entorno

/**
 * Función para guardar la posición del patio asociada a una orden.
 * @param {string} token - Token de autenticación del usuario.
 * @param {string} idOrden - ID de la orden a la que se asociará la posición del patio.
 * @param {string} posicionPatio - Posición del patio que se desea guardar.
 * @returns {Promise<Object>} - Respuesta del servidor con la confirmación de la acción.
 * @throws {Error} - Lanza un error si la solicitud falla.
 */
export const guardarPosicionPatio = async (token, idOrden, posicionPatio) => {
  try {
    // Realizar una solicitud HTTP PUT al servidor
    const response = await axios.put(
      `${BASE_URL}/ordenmongo/guardarPosicionPatio`, // Endpoint para guardar la posición del patio
      {
        idOrden, // ID de la orden
        posicionPatio, // Posición del patio a guardar
      },
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
      "Error en guardarPosicionPatio:",
      error.response?.data || error.message // Mostrar detalles de la respuesta del servidor o mensaje genérico de error
    );
    throw error; // Propagar el error para que pueda ser manejado por el llamador
  }
};
