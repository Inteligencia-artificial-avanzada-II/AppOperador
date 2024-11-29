// Importación de dependencias necesarias
import axios from "axios"; // Biblioteca para realizar solicitudes HTTP
import { BASE_URL } from "@env"; // URL base configurada en variables de entorno

/**
 * Función para actualizar el estado de un contenedor.
 * @param {string} token - Token de autenticación del usuario.
 * @param {string} idContenedor - ID del contenedor a actualizar.
 * @param {string} status - Nuevo estado a establecer para el contenedor.
 * @returns {Promise<Object>} - Respuesta del servidor con los datos actualizados.
 * @throws {Error} - Lanza un error si la solicitud falla.
 */
export const actualizarStatusContenedor = async (
  token,
  idContenedor,
  status
) => {
  try {
    // Realizar una solicitud HTTP PUT al servidor
    const response = await axios.put(
      `${BASE_URL}/contenedor/actualizarStatus/${idContenedor}`, // Endpoint para actualizar el estado del contenedor
      { status }, // Cuerpo de la solicitud con el nuevo estado
      {
        headers: {
          Authorization: `Token ${token}`, // Encabezado de autenticación con el token
        },
      }
    );

    // Devolver los datos de la respuesta si la solicitud fue exitosa
    return response.data;
  } catch (error) {
    // Manejo de errores: log en consola con detalles del error
    console.error(
      "Error en actualizarStatusContenedor:",
      error.response?.data || error.message // Mostrar detalles de la respuesta del servidor o mensaje genérico de error
    );
    throw error; // Propagar el error para que pueda ser manejado por el llamador
  }
};
