import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const QRScan = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Título de la pantalla */}
      <Text style={styles.title}>Escanear QR</Text>

      {/* Imagen del Código QR */}
      <Image
        source={{
          uri: "https://objectstorage.mx-queretaro-1.oraclecloud.com/p/79AJJfgFXexqbvQZWz9MJ_7qJ9xLb94V9XhEAGlRZJbwkfxL1F7gZP9EOHseYtm8/n/axnhu2vnql31/b/qrprueba/o/1730423946314_qrcode.png",
        }} // Reemplaza esta URL con la de tu imagen QR
        style={styles.qrImage}
      />

      {/* Botón para pasar a la siguiente pantalla */}
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => navigation.navigate("Waiting")}
      >
        <Text style={styles.buttonText}>Siguiente</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0033cc",
    marginBottom: 20,
  },
  qrImage: {
    width: 200,
    height: 200,
    marginBottom: 50, // Aumenta el margen inferior para espaciar más la imagen del botón
  },
  buttonContainer: {
    backgroundColor: "#0033cc",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    alignSelf: "center",
    marginTop: 200,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default QRScan;
