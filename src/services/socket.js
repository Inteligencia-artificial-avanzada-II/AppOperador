import { replace } from "./navigationService";
import { io } from "socket.io-client";
import { Alert } from "react-native";
import { BASE_URL } from "@env";

let socket; // Variable para almacenar la instancia del socket

export const connectSocket = (uniqueId, navigation) => {
  socket = io(BASE_URL, {
    reconnection: true, // Activar reconexión automática
    reconnectionAttempts: 5, // Número máximo de intentos de reconexión
    reconnectionDelay: 2000, // Tiempo en milisegundos entre intentos
  });

  // Evento que se dispara cuando el socket se conecta exitosamente
  socket.on("connect", () => {
    console.log(`Conectado al servidor con ID: ${socket.id}`); // Mostrar el ID del socket asignado por el servidor
    socket.emit("register", uniqueId); // Enviar evento 'register' al servidor con un identificador único
    console.log(`Registrado en el servidor con uniqueId: ${uniqueId}`);
  });

  // Manejar el evento personalizado 'bienvenida' enviado por el servidor
  socket.on("bienvenida", (data) => {
    console.log(`Mensaje del servidor: ${data.mensaje}`); // Mostrar mensaje de bienvenida recibido del servidor
  });

  // Manejar el evento 'puertaDesocupada' enviado por el servidor
  socket.on("puertaDesocupada", (data) => {
    console.log(`Evento 'puertaDesocupada' recibido:`, data); // Log de los datos enviados con el evento

    // Mostrar una alerta al usuario informando que una puerta está disponible
    Alert.alert(
      "Puerta Desocupada",
      `La puerta ${data.idPuerta} ahora está disponible.`,
      [
        {
          text: "OK", // Texto del botón
          onPress: () => {
            console.log("Recargando WaitingScreen..."); // Acción al presionar el botón OK
            navigation.replace("Waiting"); // Navegar a la pantalla 'Waiting' (asegúrate de importar y definir 'navigation')
          },
        },
      ]
    );
  });

  // Evento que se dispara cuando el socket se desconecta
  socket.on("disconnect", () => {
    console.log("Desconectado del servidor"); // Log de la desconexión
  });

  // Evento que se dispara cuando el socket se reconecta exitosamente
  socket.on("reconnect", (attempt) => {
    console.log(`Reconexión exitosa en el intento ${attempt}`); // Log del número de intento de reconexión exitoso
  });

  // Evento que se dispara durante un intento de reconexión
  socket.on("reconnect_attempt", () => {
    console.log("Intentando reconectar..."); // Log cuando se intenta reconectar
  });

  // Evento que se dispara si fallan todos los intentos de reconexión
  socket.on("reconnect_failed", () => {
    console.log("Falló la reconexión al servidor"); // Log si la reconexión no es exitosa
  });

  return socket; // Retornar la instancia del socket
};
