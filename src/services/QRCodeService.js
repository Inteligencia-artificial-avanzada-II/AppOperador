// Importación de dependencias necesarias
import axios from "axios"; // Biblioteca para realizar solicitudes HTTP
import { BASE_URL } from "@env"; // URL base configurada en las variables de entorno

/**
 * Función para obtener la URL del código QR asociada a un contenedor.
 * @param {string} token - Token de autenticación del usuario.
 * @param {string} idContenedor - ID del contenedor para consultar el código QR.
 * @returns {Promise<string>} - ID de la orden (`idOrden`) obtenida desde la URL del código QR.
 * @throws {Error} - Lanza un error si la solicitud falla.
 */
export const getQRCodeUrl = async (token, idContenedor) => {
  try {
    // Realizar una solicitud HTTP GET al servidor
    const response = await axios.get(
      `${BASE_URL}/orden/consultarQrUrl/${idContenedor}`, // Endpoint para consultar la URL del código QR
      {
        headers: {
          Authorization: `Token ${token}`, // Encabezado de autenticación con el token del usuario
        },
      }
    );

    // Log de la respuesta completa para depuración
    console.log("Response: ", response.data);

    // Devolver el `idOrden` obtenido de los datos de la respuesta
    return response.data.data.idOrden;
  } catch (error) {
    // Manejo de errores: log en consola con detalles del error
    console.error("Error al obtener el idOrden:", error.response?.data || error.message);
    throw error; // Propagar el error para que pueda ser manejado por el llamador
  }
};
