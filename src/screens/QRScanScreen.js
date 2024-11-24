// src/screens/QRScan.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getQRCodeUrl } from "../services/QRCodeService";
import { BUCKET_URL } from "@env";

const QRScan = ({ navigation }) => {
  const [qrImageUrl, setQrImageUrl] = useState("");

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const idContenedor = await AsyncStorage.getItem("idContenedor");

        if (!token || !idContenedor) {
          Alert.alert("Error", "No se encontró información de autenticación.");
          return;
        }

        // Obtén el idOrden y construye la URL de la imagen
        const idOrden = await getQRCodeUrl(token, idContenedor);
        const url = `${BUCKET_URL}${idOrden}.png`;
        console.log("URL: ", url);
        setQrImageUrl(url);

        await AsyncStorage.setItem("idOrden", String(idOrden));
        console.log("idOrden guardado en AsyncStorage:", idOrden);
      } catch (error) {
        Alert.alert("Error", "No se pudo cargar el código QR.");
      }
    };

    fetchQRCode();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escanear QR</Text>

      {qrImageUrl ? (
        <Image source={{ uri: qrImageUrl }} style={styles.qrImage} />
      ) : (
        <Text>Cargando QR...</Text>
      )}

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
    marginBottom: 50,
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
