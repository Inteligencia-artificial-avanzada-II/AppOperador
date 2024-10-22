import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const WaitingScreen = ({ navigation }) => {
  useEffect(() => {
    // Configurar un temporizador para navegar a GoToScreen después de 15 segundos
    const timer = setTimeout(() => {
      navigation.navigate("GoTo"); // Cambia "GoTo" por el nombre correcto de la pantalla en tu stack
    }, 15000); // 15000 milisegundos = 15 segundos

    // Limpiar el temporizador si el componente se desmonta antes de los 15 segundos
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Contenedor para el título y el número de placas */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>En espera</Text>
        <Text style={styles.plateNumber}>#Placas</Text>
      </View>

      {/* Contenedor para la información de la puerta */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Puerta</Text>
        <Text style={styles.infoTextBold}>Sin Asignar</Text>
      </View>
    </View>
  );
};

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
    color: "#0033cc",
  },
  plateNumber: {
    fontSize: 16,
    color: "#000",
  },
  infoContainer: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 30,
    paddingHorizontal: 100,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 50,
  },
  infoText: {
    fontSize: 24,
    color: "#000",
    marginBottom: 10,
  },
  infoTextBold: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
});

export default WaitingScreen;
