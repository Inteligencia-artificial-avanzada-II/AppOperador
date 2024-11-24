import axios from "axios";
import { BASE_URL } from "@env";

export const actualizarOcupado = async (
  token,
  idPuerta,
  idOrden,
  idContenedor,
  status
) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/puerta/actualizarOcupado/${idPuerta}`,
      {
        idOrden,
        idContenedor,
        status,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error en actualizarOcupado:",
      error.response?.data || error.message
    );
    throw error;
  }
};
