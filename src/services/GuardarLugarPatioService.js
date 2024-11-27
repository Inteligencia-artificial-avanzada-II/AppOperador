import axios from "axios";
import { BASE_URL } from "@env";

export const guardarPosicionPatio = async (token, idOrden, posicionPatio) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/ordenmongo/guardarPosicionPatio`,
      {
        idOrden,
        posicionPatio,
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
      "Error en guardarPosicionPatio:",
      error.response?.data || error.message
    );
    throw error; 
  }
};
