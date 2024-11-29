// Importación de dependencias necesarias
import axios from "axios"; // Biblioteca para realizar solicitudes HTTP
import { BASE_URL } from "@env"; // URL base configurada en las variables de entorno

/**
 * Función para actualizar el estado del camión asociado a una orden.
 * @param {string} idOrden - ID de la orden a actualizar.
 * @param {string} token - Token de autenticación del usuario.
 * @returns {Promise<Object>} - Respuesta del servidor con los datos actualizados.
 * @throws {Error} - Lanza un error si la solicitud falla.
 */
export const actualizarCamion = async (idOrden, token) => {
  try {
    // Realizar una solicitud HTTP PUT al servidor
    const response = await axios.put(
      `${BASE_URL}/orden/actualizarCamion/${idOrden}`, // Endpoint para actualizar el camión
      {}, // Cuerpo vacío porque la actualización no requiere datos adicionales
      {
        headers: {
          Authorization: `Token ${token}`, // Token para la autenticación en la solicitud
        },
      }
    );

    // Devolver los datos de la respuesta si la solicitud fue exitosa
    return response.data;
  } catch (error) {
    // Manejo de errores: log en consola con detalles del error
    console.error(
      "Error al actualizar el camión:",
      error.response?.data || error.message // Mostrar detalles de la respuesta del servidor o mensaje del error
    );
    throw error; // Propagar el error para que pueda ser manejado por el llamador
  }
};
