// Importación de dependencias necesarias para la funcionalidad de la pantalla
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { actualizarStatusContenedor } from "../services/ActualizarStatusService"; // Servicio para actualizar el estado del contenedor
import AsyncStorage from "@react-native-async-storage/async-storage"; // Biblioteca para almacenamiento local

// Componente principal GoToScreen
const GoToScreen = ({ navigation }) => {
  // Estados para almacenar información de la orden y la puerta
  const [idOrden, setIdOrden] = useState(""); // ID de la orden actual
  const [idPuerta, setIdPuerta] = useState(""); // ID de la puerta asignada

  // useEffect para cargar datos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedIdOrden = await AsyncStorage.getItem("idOrden"); // Recuperar ID de la orden desde AsyncStorage
        const storedIdPuerta = await AsyncStorage.getItem("idPuerta"); // Recuperar ID de la puerta desde AsyncStorage

        // Asignar los valores a los estados si existen
        if (storedIdOrden) setIdOrden(storedIdOrden);
        if (storedIdPuerta) setIdPuerta(storedIdPuerta);
      } catch (error) {
        // Manejo de errores al cargar datos desde AsyncStorage
        console.error("Error al cargar datos de AsyncStorage:", error);
        Alert.alert(
          "Error",
          "No se pudo cargar la información de la orden o puerta."
        );
      }
    };

    fetchData(); // Llamar a la función de carga inicial
  }, []);

  // Función para actualizar el estado del contenedor a "Descargando"
  const handleDescargar = async () => {
    try {
      const idContenedor = await AsyncStorage.getItem("idContenedor"); // Recuperar ID del contenedor

      // Validar si existe un ID de contenedor
      if (!idContenedor) {
        Alert.alert("Error", "No se encontró un ID de contenedor válido.");
        return;
      }

      const nuevoStatus = "Descargando"; // Nuevo estado del contenedor

      // Llamar al servicio para actualizar el estado
      const response = await actualizarStatusContenedor(
        idContenedor,
        nuevoStatus
      );
      Alert.alert(
        "Éxito",
        "El estado del contenedor se actualizó a Descargando."
      ); // Mostrar mensaje de éxito
      console.log("Respuesta de la API:", response);

      // Navegar a la pantalla de descarga
      navigation.navigate("Unloading");
    } catch (error) {
      // Manejo de errores en la llamada a la API
      console.error("Error al actualizar el estado:", error);
      Alert.alert(
        "Error",
        "Hubo un problema al actualizar el estado del contenedor."
      );
    }
  };

  return (
    // Contenedor principal de la pantalla
    <View style={styles.container}>
      {/* Contenedor para el título y el número de placas */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Dirigirse a</Text>
        <Text style={styles.plateNumber}>
          {idOrden ? `# ${idOrden}` : "#Placas"} {/* Mostrar ID de la orden o texto por defecto */}
        </Text>
      </View>

      {/* Contenedor para la información de la puerta */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Puerta</Text>
        <View style={styles.circle}>
          <Text style={styles.circleText}>
            {idPuerta ? idPuerta : "Sin Asignar"} {/* Mostrar ID de la puerta o texto por defecto */}
          </Text>
        </View>
      </View>

      {/* Botón para cambiar el estado del contenedor a "Descargando" */}
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleDescargar}
      >
        <Text style={styles.buttonText}>Descargando</Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos para la interfaz de usuario
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 150,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0033cc", // Color principal
  },
  plateNumber: {
    fontSize: 16,
    color: "#000", // Color del texto
  },
  infoContainer: {
    backgroundColor: "#f5f5f5", // Fondo gris claro
    paddingVertical: 30,
    paddingHorizontal: 100,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 50,
  },
  infoText: {
    fontSize: 24,
    color: "#000", // Texto negro
    marginBottom: 10,
  },
  infoTextBold: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30, // Círculo perfecto
    backgroundColor: "#0033cc", // Color de fondo azul
    justifyContent: "center",
    alignItems: "center", // Centrar texto dentro del círculo
  },
  circleText: {
    fontSize: 24,
    color: "#fff", // Texto blanco
    fontWeight: "bold", // Negrita
  },
  buttonContainer: {
    position: "absolute", // Posición absoluta para ubicar el botón
    bottom: 100, // Separación desde la parte inferior
    backgroundColor: "#0033cc", // Fondo azul
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "80%", // Ancho del botón
    alignSelf: "center", // Centrar el botón horizontalmente
  },
  buttonText: {
    color: "#fff", // Texto blanco
    fontSize: 16,
    fontWeight: "bold", // Negrita
  },
});

// Exportar el componente GoToScreen
export default GoToScreen;
