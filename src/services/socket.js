import { io } from "socket.io-client";
import { Alert } from "react-native";
import { BASE_URL } from "@env";

let socket;

export const connectSocket = (uniqueId) => {
  socket = io(BASE_URL, {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  socket.on("connect", () => {
    console.log(`Conectado al servidor con ID: ${socket.id}`);
    socket.emit("register", uniqueId);
    console.log(`Registrado en el servidor con uniqueId: ${uniqueId}`);
  });

  socket.on("bienvenida", (data) => {
    console.log(`Mensaje del servidor: ${data.mensaje}`);
  });

  socket.on("puertaDesocupada", (data) => {
    console.log(`Evento 'puertaDesocupada' recibido:`, data);

    // Mostrar una alerta al usuario
    Alert.alert(
      "Puerta Desocupada",
      `La puerta ${data.idPuerta} ahora está disponible.`,
      [{ text: "OK", onPress: () => console.log("Alerta cerrada") }]
    );
  });

  socket.on("disconnect", () => {
    console.log("Desconectado del servidor");
  });

  socket.on("reconnect", (attempt) => {
    console.log(`Reconexión exitosa en el intento ${attempt}`);
  });

  socket.on("reconnect_attempt", () => {
    console.log("Intentando reconectar...");
  });

  socket.on("reconnect_failed", () => {
    console.log("Falló la reconexión al servidor");
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log("Socket desconectado");
  }
};

export const getSocket = () => socket;
