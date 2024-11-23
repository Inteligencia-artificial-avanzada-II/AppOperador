import axios from "axios";
import { BASE_URL } from "@env";

export const actualizarStatusContenedor = async (
  token,
  idContenedor,
  status
) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/contenedor/actualizarStatus/${idContenedor}`,
      { status },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error en actualizarStatusContenedor:",
      error.response?.data || error.message
    );
    throw error;
  }
};
