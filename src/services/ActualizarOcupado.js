// Importación de dependencias necesarias
import axios from "axios"; // Biblioteca para realizar solicitudes HTTP
import { BASE_URL } from "@env"; // URL base configurada en variables de entorno

/**
 * Función para actualizar el estado de ocupación de una puerta.
 * @param {string} token - Token de autenticación del usuario.
 * @param {string} idPuerta - ID de la puerta a actualizar.
 * @param {string} idOrden - ID de la orden asociada a la puerta.
 * @param {string} idContenedor - ID del contenedor asociado a la puerta.
 * @param {string} status - Nuevo estado a establecer para la puerta.
 * @returns {Promise<Object>} - Respuesta del servidor con los datos actualizados.
 * @throws {Error} - Lanza un error si la solicitud falla.
 */
export const actualizarOcupado = async (
  token,
  idPuerta,
  idOrden,
  idContenedor,
  status
) => {
  try {
    // Realizar una solicitud HTTP PUT al servidor
    const response = await axios.put(
      `${BASE_URL}/puerta/actualizarOcupado/${idPuerta}`, // Endpoint para actualizar el estado de la puerta
      {
        idOrden, // ID de la orden que ocupa o desocupa la puerta
        idContenedor, // ID del contenedor asociado
        status, // Nuevo estado a establecer (por ejemplo, "Disponible" o "Ocupado")
      },
      {
        headers: {
          Authorization: `Token ${token}`, // Encabezado de autenticación
        },
      }
    );

    // Devolver los datos de la respuesta si la solicitud fue exitosa
    return response.data;
  } catch (error) {
    // Manejo de errores: log en consola con detalles del error
    console.error(
      "Error en actualizarOcupado:",
      error.response?.data || error.message // Mostrar detalles de la respuesta del servidor o mensaje de error
    );
    throw error; // Propagar el error para que pueda ser manejado por el llamador
  }
};
