import axios from "axios";
import { BASE_URL } from "@env";

export const actualizarCamion = async (idOrden, token) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/orden/actualizarCamion/${idOrden}`,
      {},
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error al actualizar el camión:",
      error.response?.data || error.message
    );
    throw error;
  }
};
