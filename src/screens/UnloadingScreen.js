// Importación de dependencias necesarias
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { actualizarOcupado } from "../services/ActualizarOcupado"; // Servicio para actualizar el estado del contenedor
import AsyncStorage from "@react-native-async-storage/async-storage"; // Biblioteca para almacenamiento local persistente

// Componente principal de la pantalla UnloadingScreen
const UnloadingScreen = ({ navigation }) => {
  // Estados para almacenar la información de la orden y la puerta
  const [idOrden, setIdOrden] = useState("#Placas"); // ID de la orden (valor predeterminado)
  const [idPuerta, setIdPuerta] = useState("Sin Asignar"); // ID de la puerta asignada (valor predeterminado)

  // useEffect para cargar datos iniciales desde AsyncStorage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedIdOrden = await AsyncStorage.getItem("idOrden"); // Recuperar el ID de la orden
        const storedIdPuerta = await AsyncStorage.getItem("idPuerta"); // Recuperar el ID de la puerta

        // Asignar los valores a los estados si están disponibles
        if (storedIdOrden) {
          setIdOrden(storedIdOrden);
          console.log("idOrden cargado desde AsyncStorage:", storedIdOrden);
        }

        if (storedIdPuerta) {
          setIdPuerta(storedIdPuerta);
          console.log("idPuerta cargado desde AsyncStorage:", storedIdPuerta);
        }
      } catch (error) {
        // Manejo de errores al cargar datos
        console.error("Error al cargar datos de AsyncStorage:", error);
        Alert.alert("Error", "Hubo un problema al cargar los datos.");
      }
    };

    fetchData(); // Llamar a la función de carga inicial
  }, []);

  // Función para manejar la acción de "Descargar"
  const handleDescargar = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken"); // Recuperar el token del usuario

      // Validar si el token está disponible
      if (!token) {
        Alert.alert("Error", "No se encontró el token de autenticación.");
        return;
      }

      // Recuperar datos adicionales desde AsyncStorage
      const idPuerta = await AsyncStorage.getItem("idPuerta");
      const idOrden = await AsyncStorage.getItem("idOrden");
      const idContenedor = await AsyncStorage.getItem("idContenedor");
      const status = "Disponible"; // Estado que se desea establecer

      // Llamar al servicio para actualizar el estado del contenedor
      await actualizarOcupado(token, idPuerta, idOrden, idContenedor, status);

      Alert.alert("Éxito", "La descarga se ha registrado correctamente."); // Mostrar mensaje de éxito
      navigation.navigate("Unloaded"); // Navegar a la siguiente pantalla
    } catch (error) {
      // Manejo de errores al actualizar el estado
      Alert.alert("Error", "Hubo un problema al actualizar el estado.");
      console.error("Error en handleDescargar:", error);
    }
  };

  return (
    // Contenedor principal de la pantalla
    <View style={styles.container}>
      {/* Contenedor para el título y el ID de la orden */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Descargando en</Text>
        <Text style={styles.plateNumber}>{idOrden}</Text> {/* Mostrar el ID de la orden */}
      </View>

      {/* Contenedor para la información de la puerta */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Puerta</Text>
        <View style={styles.circle}>
          <Text style={styles.circleText}>{idPuerta}</Text> {/* Mostrar el ID de la puerta */}
        </View>
      </View>

      {/* Botón para registrar que la descarga está completa */}
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleDescargar}
      >
        <Text style={styles.buttonText}>Descargado</Text> {/* Texto del botón */}
      </TouchableOpacity>
    </View>
  );
};

// Estilos para la interfaz de usuario
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa toda la pantalla
    backgroundColor: "#fff", // Fondo blanco
    padding: 20, // Espaciado interno
    justifyContent: "flex-start", // Alinear elementos verticalmente
    alignItems: "center", // Centrar elementos horizontalmente
    paddingTop: 150, // Espaciado superior
  },
  headerContainer: {
    flexDirection: "row", // Organizar elementos en una fila
    justifyContent: "space-between", // Espaciar elementos uniformemente
    alignItems: "center", // Centrar elementos verticalmente
    width: "100%", // Ancho completo
    marginBottom: 40, // Espaciado inferior
  },
  title: {
    fontSize: 30, // Tamaño del texto del título
    fontWeight: "bold", // Texto en negrita
    color: "#0033cc", // Color azul del título
  },
  plateNumber: {
    fontSize: 16, // Tamaño del texto del número de placa
    color: "#000", // Color negro del texto
  },
  infoContainer: {
    backgroundColor: "#f5f5f5", // Fondo gris claro
    paddingVertical: 30, // Espaciado interno vertical
    paddingHorizontal: 100, // Espaciado interno horizontal
    borderRadius: 10, // Bordes redondeados
    alignItems: "center", // Centrar texto dentro del contenedor
    marginTop: 50, // Margen superior
  },
  infoText: {
    fontSize: 24, // Tamaño del texto de información
    color: "#000", // Texto negro
    marginBottom: 10, // Espaciado inferior
  },
  circle: {
    width: 60, // Ancho del círculo
    height: 60, // Altura del círculo
    borderRadius: 30, // Bordes redondeados para hacer un círculo
    backgroundColor: "#0033cc", // Fondo azul
    justifyContent: "center", // Centrar texto verticalmente
    alignItems: "center", // Centrar texto horizontalmente
  },
  circleText: {
    fontSize: 24, // Tamaño del texto dentro del círculo
    color: "#fff", // Texto blanco
    fontWeight: "bold", // Texto en negrita
  },
  buttonContainer: {
    position: "absolute", // Posición absoluta
    bottom: 100, // Ubicación desde la parte inferior
    backgroundColor: "#0033cc", // Fondo azul del botón
    padding: 15, // Espaciado interno del botón
    borderRadius: 10, // Bordes redondeados
    alignItems: "center", // Centrar el texto del botón
    width: "80%", // Ancho relativo al contenedor principal
    alignSelf: "center", // Centrar el botón horizontalmente
  },
  buttonText: {
    color: "#fff", // Texto blanco
    fontSize: 16, // Tamaño del texto del botón
    fontWeight: "bold", // Texto en negrita
  },
});

// Exportar el componente para usarlo en otras partes de la aplicación
export default UnloadingScreen;
