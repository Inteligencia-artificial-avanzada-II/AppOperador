// Importación de dependencias necesarias para la funcionalidad de la pantalla
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
import { BlurView } from "expo-blur"; // Efecto de desenfoque en la pantalla
import AsyncStorage from "@react-native-async-storage/async-storage"; // Almacenamiento local persistente
import { consultarPuerta } from "../services/ConsultarPuertaService"; // Servicio para consultar la puerta asignada
import { actualizarStatusContenedor } from "../services/ActualizarStatusService"; // Servicio para actualizar el estado del contenedor
import { Ionicons } from "@expo/vector-icons"; // Biblioteca de iconos
import { guardarPosicionPatio } from "../services/GuardarLugarPatioService"; // Servicio para guardar la posición del patio
import { actualizarCamion } from "../services/ActualizarCamionService"; // Servicio para actualizar información del camión

// Componente principal WaitingScreen
const WaitingScreen = ({ navigation }) => {
  // Estados para almacenar datos y manejar la interfaz
  const [inputText, setInputText] = useState(""); // Texto ingresado por el usuario
  const [puerta, setPuerta] = useState("Sin Asignar"); // Estado inicial de la puerta asignada
  const [idOrden, setIdOrden] = useState(""); // ID de la orden actual
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false); // Estado para el teclado

  // Referencias para manejar animaciones
  const keyboardOffset = useRef(new Animated.Value(0)).current; // Movimiento del teclado
  const blurOpacity = useRef(new Animated.Value(0)).current; // Opacidad del desenfoque

  // useEffect para cargar datos iniciales al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const idContenedor = await AsyncStorage.getItem("idContenedor"); // Recuperar ID del contenedor
        const token = await AsyncStorage.getItem("userToken"); // Recuperar token del usuario
        const storedIdOrden = await AsyncStorage.getItem("idOrden"); // Recuperar ID de la orden

        if (!idContenedor) {
          Alert.alert("Error", "No se encontró un ID de contenedor válido.");
          return;
        }

        // Asignar el ID de la orden si está almacenado
        if (storedIdOrden) {
          setIdOrden(storedIdOrden);
          console.log("idOrden cargado desde AsyncStorage:", storedIdOrden);
        }

        // Llamar al servicio para consultar la puerta asignada
        const response = await consultarPuerta(token, idContenedor);
        console.log("Respuesta de la API:", response);

        // Si hay una puerta asignada, actualizar el estado y guardar en AsyncStorage
        if (response.idPuerta) {
          setPuerta(`${response.idPuerta}`);
          await AsyncStorage.setItem("idPuerta", String(response.idPuerta));
          console.log("idPuerta guardado en AsyncStorage:", response.idPuerta);
        } else {
          setPuerta("Sin Asignar");
        }
      } catch (error) {
        setPuerta("Sin Asignar"); // Manejo de errores
      }
    };

    fetchData(); // Ejecutar la función de carga inicial
  }, []);

  // useEffect para manejar animaciones del teclado
  useEffect(() => {
    // Listener para mostrar el teclado
    const keyboardShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setIsKeyboardVisible(true); // Actualizar estado
        Animated.parallel([
          Animated.timing(keyboardOffset, {
            toValue: -e.endCoordinates.height + 50, // Mover la interfaz
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(blurOpacity, {
            toValue: 1, // Incrementar opacidad del desenfoque
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
    );

    // Listener para ocultar el teclado
    const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
      Animated.parallel([
        Animated.timing(keyboardOffset, {
          toValue: 0, // Restaurar la interfaz
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(blurOpacity, {
          toValue: 0, // Reducir opacidad del desenfoque
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setIsKeyboardVisible(false));
    });

    // Eliminar listeners al desmontar el componente
    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, [keyboardOffset, blurOpacity]);

  // Función para manejar la separación del camión
  const handleSeparation = async () => {
    try {
      const idOrden = await AsyncStorage.getItem("idOrden"); // Recuperar ID de la orden
      if (!idOrden) {
        Alert.alert("Error", "No se encontró el ID de la orden.");
        return;
      }

      // Llamar al servicio para actualizar el camión
      const response = await actualizarCamion(idOrden);
      console.log("Respuesta de la API de actualizar camión:", response);

      Alert.alert("Éxito", "El camión se separó correctamente.");
    } catch (error) {
      console.error("Error al actualizar el camión:", error.message || error);
      Alert.alert(
        "Error",
        "Hubo un problema al actualizar el estado del camión. Intenta nuevamente."
      );
    }
  };

  // Función para avanzar a la siguiente pantalla
  const handleNext = async () => {
    try {
      const idContenedor = await AsyncStorage.getItem("idContenedor"); // Recuperar ID del contenedor
      const token = await AsyncStorage.getItem("userToken"); // Recuperar token del usuario

      if (!idContenedor || !token) {
        Alert.alert(
          "Error",
          "No se encontró un ID de contenedor válido o un token."
        );
        return;
      }

      // Actualizar el estado del contenedor
      const nuevoStatus = "Descargando";
      const response = await actualizarStatusContenedor(
        token,
        idContenedor,
        nuevoStatus
      );
      console.log("Respuesta de la API:", response);

      // Navegar a la pantalla de descarga
      navigation.navigate("Unloading");
    } catch (error) {
      console.error("Error al actualizar el estado:", error.message || error);
      Alert.alert(
        "Error",
        "Hubo un problema al actualizar el estado del contenedor."
      );
    }
  };

  // Función para guardar la posición del patio
  const handleSendMessage = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken"); // Recuperar token del usuario
      const idOrden = await AsyncStorage.getItem("idOrden"); // Recuperar ID de la orden
      const posicionPatio = inputText.trim(); // Limpiar texto ingresado

      if (!token || !idOrden || !posicionPatio) {
        Alert.alert("Error", "Faltan datos para procesar la solicitud.");
        return;
      }

      // Llamar al servicio para guardar la posición
      const response = await guardarPosicionPatio(token, idOrden, posicionPatio);
      console.log("Respuesta de la API:", response);

      Alert.alert("Éxito", "La posición del patio se guardó correctamente.");
      setInputText(""); // Limpiar el campo de texto
    } catch (error) {
      console.error(
        "Error al guardar la posición del patio:",
        error.message || error
      );
      Alert.alert(
        "Error",
        "Hubo un problema al enviar la posición del patio."
      );
    }
  };

  return (
    // Estructura de la pantalla, incluyendo desenfoque y botones
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {isKeyboardVisible && (
          <Animated.View
            style={[
              styles.blurContainer,
              { opacity: blurOpacity }, // Cambiar opacidad
            ]}
          >
            <BlurView intensity={50} style={styles.blurView} />
          </Animated.View>
        )}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>En espera</Text>
          <Text style={styles.plateNumber}>
            {idOrden ? `Orden: ${idOrden}` : ""}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Puerta</Text>
          <Text style={styles.infoTextBold}>{puerta}</Text>
        </View>
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
        {puerta !== "Sin Asignar" && (
          <TouchableOpacity style={styles.buttonContainer} onPress={handleNext}>
            <Text style={styles.buttonText}>Siguiente</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
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
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
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
