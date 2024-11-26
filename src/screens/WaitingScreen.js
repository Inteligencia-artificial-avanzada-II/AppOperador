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
import { Ionicons } from "@expo/vector-icons";

const WaitingScreen = ({ navigation }) => {
  const [inputText, setInputText] = useState("");
  const [puerta, setPuerta] = useState("Sin Asignar"); // Estado inicial para mostrar la puerta
  const [idOrden, setIdOrden] = useState(""); // Estado inicial para idOrden
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const keyboardOffset = useRef(new Animated.Value(0)).current; // Animación para el movimiento
  const blurOpacity = useRef(new Animated.Value(0)).current; // Animación para el desenfoque

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idContenedor = await AsyncStorage.getItem("idContenedor");
        const token = await AsyncStorage.getItem("userToken");
        const storedIdOrden = await AsyncStorage.getItem("idOrden"); // Obtén idOrden desde AsyncStorage

        if (!idContenedor) {
          Alert.alert("Error", "No se encontró un ID de contenedor válido.");
          return;
        }

        // Asignar idOrden si existe
        if (storedIdOrden) {
          setIdOrden(storedIdOrden);
          console.log("idOrden cargado desde AsyncStorage:", storedIdOrden);
        }

        // Consultar la puerta
        const response = await consultarPuerta(token, idContenedor);
        console.log("Respuesta de la API:", response);

        // Si hay idPuerta, mostrar el número; si no, mantener "Sin Asignar"
        if (response.idPuerta) {
          setPuerta(`${response.idPuerta}`);
          await AsyncStorage.setItem("idPuerta", String(response.idPuerta)); // Guardar idPuerta
          console.log("idPuerta guardado en AsyncStorage:", response.idPuerta);
        } else {
          setPuerta("Sin Asignar");
        }
      } catch (error) {
        console.error("Error al consultar la puerta o idOrden:", error);

        setPuerta("Sin Asignar"); // Si falla, mostrar "Sin Asignar"
      }
    };

    fetchData();
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

  const handleSeparation = () => {
    Alert.alert("Notificación", "El camión se separó de la caja.");
    console.log("El camión se separó de la caja.");
  };

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

  const handleSendMessage = () => {
    Alert.alert("Mensaje enviado", inputText || "Sin mensaje ingresado");
    setInputText(""); // Limpiar el texto después de enviar
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
          <Text style={styles.plateNumber}>
            {idOrden ? `Orden: ${idOrden}` : ""}
          </Text>
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
            <View style={styles.inputWithIconContainer}>
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
              <TouchableOpacity onPress={handleSendMessage}>
                <Ionicons name="send" size={24} color="#0033cc" />
              </TouchableOpacity>
            </View>

            {/* Botón adicional cuando se muestra el input */}
            <TouchableOpacity
              style={[styles.secondButtonContainer, { marginTop: 20 }]}
              onPress={handleSeparation}
            >
              <Text style={styles.buttonText}>
                El camión dejó el contenedor
              </Text>
            </TouchableOpacity>
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
    flex: 1,
    fontSize: 16,
  },
  instructionText: {
    fontSize: 15,
    marginBottom: 10,
    color: "#0033cc",
    fontWeight: "bold",
  },
  inputWithIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
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
  secondButtonContainer: {
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
