import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const GoToScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Contenedor para el título y el número de placas */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Dirigirse a</Text>
        <Text style={styles.plateNumber}>#Placas</Text>
      </View>

      {/* Contenedor para la información de la puerta */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Puerta</Text>
        <View style={styles.circle}>
          <Text style={styles.circleText}>3</Text>
        </View>
      </View>

      {/* Botón de Descargar */}
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => navigation.navigate("Unloading")}
      >
        <Text style={styles.buttonText}>Descargando</Text>
      </TouchableOpacity>
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
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0033cc",
    justifyContent: "center",
    alignItems: "center",
  },
  circleText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 100,
    backgroundColor: "#0033cc",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default GoToScreen;
