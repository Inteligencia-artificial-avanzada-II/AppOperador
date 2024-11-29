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
import AsyncStorage from "@react-native-async-storage/async-storage"; // Manejo del almacenamiento local
import { getQRCodeUrl } from "../services/QRCodeService"; // Servicio para obtener la URL del código QR
import { BUCKET_URL } from "@env"; // URL base para las imágenes del QR

/**
 * Pantalla para visualizar el código QR generado.
 * @param {Object} navigation - Objeto de navegación proporcionado por React Navigation.
 */
const QRScan = ({ navigation }) => {
  const [qrImageUrl, setQrImageUrl] = useState(""); // Estado para almacenar la URL del código QR

  /**
   * Efecto que se ejecuta al montar el componente.
   * - Obtiene el token del usuario y el idContenedor.
   * - Llama al servicio para obtener el idOrden y construye la URL de la imagen.
   */
  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        // Obtiene el token y el idContenedor desde AsyncStorage
        const token = await AsyncStorage.getItem("userToken");
        const idContenedor = await AsyncStorage.getItem("idContenedor");

        if (!token || !idContenedor) {
          // Muestra una alerta si falta información de autenticación
          Alert.alert("Error", "No se encontró información de autenticación.");
          return;
        }

        // Llama al servicio para obtener el idOrden
        const idOrden = await getQRCodeUrl(token, idContenedor);
        const url = `${BUCKET_URL}${idOrden}.png`; // Construye la URL de la imagen del QR
        console.log("URL: ", url);

        setQrImageUrl(url); // Actualiza el estado con la URL del QR

        // Guarda el idOrden en AsyncStorage para usarlo más adelante
        await AsyncStorage.setItem("idOrden", String(idOrden));
        console.log("idOrden guardado en AsyncStorage:", idOrden);
      } catch (error) {
        // Muestra una alerta si ocurre un error
        Alert.alert("Error", "No se pudo cargar el código QR.");
      }
    };

    fetchQRCode(); // Llama a la función al montar el componente
  }, []);

  return (
    <View style={styles.container}>
      {/* Título de la pantalla */}
      <Text style={styles.title}>Escanear QR</Text>

      {/* Muestra la imagen del QR si está disponible, o un mensaje de carga */}
      {qrImageUrl ? (
        <Image source={{ uri: qrImageUrl }} style={styles.qrImage} />
      ) : (
        <Text>Cargando QR...</Text>
      )}

      {/* Botón para avanzar a la siguiente pantalla */}
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
