// src/services/AuthService.js
import axios from "axios";
import { BASE_URL } from "@env";

export const loginContenedor = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/contenedor/login`, {
      userName: email,
      contraseña: password,
    });
    return response.data;
  } catch (error) {
    console.error("Error en loginContenedor:", error);
    throw error;
  }
};
