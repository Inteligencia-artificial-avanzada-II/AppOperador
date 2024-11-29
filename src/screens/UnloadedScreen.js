// Importación de dependencias necesarias para la funcionalidad de la pantalla
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

// Componente principal UnloadedScreen
const UnloadedScreen = ({ navigation }) => {
  return (
    // Contenedor principal de la pantalla
    <View style={styles.container}>
      {/* Icono de éxito que indica que el camión ha sido descargado */}
      <Image
        source={require("../../assets/OK.png")} // Ruta del icono de éxito, asegúrate de que el archivo exista en esta ubicación
        style={styles.icon} // Estilos aplicados al icono
      />

      {/* Texto principal indicando que el camión ha sido descargado */}
      <Text style={styles.title}>Camión Descargado</Text>

      {/* Botón para regresar al inicio o login */}
      <TouchableOpacity
        style={styles.button} // Estilos del botón
        onPress={() => navigation.navigate("Login")} // Navegar a la pantalla de Login, cámbiala según la necesidad
      >
        {/* Texto dentro del botón */}
        <Text style={styles.buttonText}>Inicio</Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos para la pantalla y sus elementos
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa toda la pantalla
    backgroundColor: "#fff", // Fondo blanco
    justifyContent: "center", // Centrar elementos verticalmente
    alignItems: "center", // Centrar elementos horizontalmente
    padding: 20, // Espaciado interno
  },
  icon: {
    width: 100, // Ancho del icono
    height: 100, // Alto del icono
    marginBottom: 20, // Espaciado inferior entre el icono y el título
  },
  title: {
    fontSize: 24, // Tamaño del texto
    fontWeight: "bold", // Negrita para destacar el texto
    color: "#000", // Color negro para el texto
    marginBottom: 20, // Espaciado inferior entre el título y el botón
  },
  button: {
    backgroundColor: "#0033cc", // Fondo azul para el botón
    padding: 15, // Espaciado interno del botón
    borderRadius: 10, // Bordes redondeados
    alignItems: "center", // Centrar el texto horizontalmente
    width: "80%", // Ancho relativo al contenedor
    position: "absolute", // Ubicación fija del botón
    bottom: 150, // Distancia desde la parte inferior de la pantalla
  },
  buttonText: {
    color: "#fff", // Texto blanco
    fontSize: 16, // Tamaño del texto
    fontWeight: "bold", // Texto en negrita
  },
});

// Exportar el componente para su uso en otras partes de la aplicación
export default UnloadedScreen;
