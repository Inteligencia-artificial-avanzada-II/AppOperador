// src/services/QRCodeService.js
import axios from "axios";
import { BASE_URL } from "@env";

export const getQRCodeUrl = async (token, idContenedor) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/orden/consultarQrUrl/${idContenedor}`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    console.log("Response: ", response.data);
    return response.data.data.idOrden; // Devuelve idOrden
  } catch (error) {
    console.error("Error al obtener el idOrden:", error);
    throw error;
  }
};
