import axios from "axios";
import { BASE_URL } from "@env";

export const consultarPuerta = async (token, idContenedor) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/puertacontenedor/consultarPuerta/${idContenedor}`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error en consultarPuerta:",
      error.response?.data || error.message
    );
    throw error;
  }
};
