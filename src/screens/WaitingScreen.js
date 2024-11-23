import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
} from "react-native";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { consultarPuerta } from "../services/ConsultarPuertaService";
import { actualizarStatusContenedor } from "../services/ActualizarStatusService";

const WaitingScreen = ({ navigation }) => {
  const [inputText, setInputText] = useState("");
  const [puerta, setPuerta] = useState("Sin Asignar"); // Estado inicial para mostrar la puerta
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const keyboardOffset = useRef(new Animated.Value(0)).current; // Animación para el movimiento
  const blurOpacity = useRef(new Animated.Value(0)).current; // Animación para el desenfoque

  useEffect(() => {
    const fetchPuerta = async () => {
      try {
        const idContenedor = await AsyncStorage.getItem("idContenedor");
        const token = await AsyncStorage.getItem("userToken");
        if (!idContenedor) {
          Alert.alert("Error", "No se encontró un ID de contenedor válido.");
          return;
        }

        const response = await consultarPuerta(token, idContenedor); // Consultar la puerta
        console.log("Respuesta de la API:", response);
        // Si hay idPuerta, mostrar el número; si no, mantener "Sin Asignar"
        setPuerta(response.idPuerta ? `${response.idPuerta}` : "Sin Asignar");
      } catch (error) {
        console.error("Error al consultar la puerta:", error);
        Alert.alert("Error", "Hubo un problema al consultar la puerta.");
        setPuerta("Sin Asignar"); // Si falla, mostrar "Sin Asignar"
      }
    };

    fetchPuerta();
  }, []);

  useEffect(() => {
    // Mostrar el teclado
    const keyboardShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setIsKeyboardVisible(true);
        Animated.parallel([
          Animated.timing(keyboardOffset, {
            toValue: -e.endCoordinates.height + 50,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(blurOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
    );

    // Ocultar el teclado
    const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
      Animated.parallel([
        Animated.timing(keyboardOffset, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(blurOpacity, {
          toValue: 0, // Desactiva el desenfoque
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setIsKeyboardVisible(false));
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, [keyboardOffset, blurOpacity]);

  const handleNext = async () => {
    try {
      const idContenedor = await AsyncStorage.getItem("idContenedor");
      const token = await AsyncStorage.getItem("userToken");
      if (!idContenedor || !token) {
        Alert.alert(
          "Error",
          "No se encontró un ID de contenedor válido o un token."
        );
        return;
      }

      const nuevoStatus = "Descargando";

      // Llamar a la API para actualizar el estado
      const response = await actualizarStatusContenedor(
        token,
        idContenedor,
        nuevoStatus
      );
      console.log("Respuesta de la API:", response);

      // Navegar a la siguiente pantalla
      navigation.navigate("Unloading");
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      Alert.alert(
        "Error",
        "Hubo un problema al actualizar el estado del contenedor."
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* BlurView animado para el desenfoque */}
        {isKeyboardVisible && (
          <Animated.View
            style={[
              styles.blurContainer,
              { opacity: blurOpacity }, // Cambia la opacidad del desenfoque
            ]}
          >
            <BlurView intensity={50} style={styles.blurView} />
          </Animated.View>
        )}

        {/* Contenedor para el título y el número de placas */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>En espera</Text>
          <Text style={styles.plateNumber}>#Placas</Text>
        </View>

        {/* Contenedor para la información de la puerta */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Puerta</Text>
          <Text style={styles.infoTextBold}>{puerta}</Text>
        </View>

        {/* Mostrar el campo de entrada solo si no hay puerta */}
        {puerta === "Sin Asignar" && (
          <Animated.View
            style={[
              styles.inputContainer,
              { transform: [{ translateY: keyboardOffset }] },
            ]}
          >
            <Text style={styles.instructionText}>
              Especifica el lugar donde se dejó el contenedor
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ingresa el lugar aquí"
              value={inputText}
              onChangeText={setInputText}
              multiline={true}
              scrollEnabled={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
          </Animated.View>
        )}

        {/* Mostrar botón si hay puerta asignada */}
        {puerta !== "Sin Asignar" && (
          <TouchableOpacity style={styles.buttonContainer} onPress={handleNext}>
            <Text style={styles.buttonText}>Siguiente</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
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
  blurContainer: {
    ...StyleSheet.absoluteFillObject, // Ocupa toda la pantalla
    zIndex: 1, // Asegura que el desenfoque esté encima
  },
  blurView: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
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
    marginTop: 70,
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
  inputContainer: {
    marginTop: 80,
    width: "100%",
    alignItems: "center",
    zIndex: 2,
  },
  textInput: {
    width: "90%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    minHeight: 100,
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#0033cc",
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

export default WaitingScreen;
