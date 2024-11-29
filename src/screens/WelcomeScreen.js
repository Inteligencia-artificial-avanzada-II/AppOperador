import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import globalStyles from "../globalStyles"; // Importa estilos globales
import { Ionicons } from "@expo/vector-icons"; // Para mostrar íconos de visibilidad de contraseña
import { loginContenedor } from "../services/AuthService"; // Función para manejar el inicio de sesión
import AsyncStorage from "@react-native-async-storage/async-storage"; // Manejo del almacenamiento local
import { connectSocket } from "../services/socket"; // Función para conectar sockets

/**
 * Pantalla de bienvenida donde los usuarios inician sesión.
 * @param {Object} navigation - Objeto de navegación proporcionado por React Navigation.
 */
const WelcomeScreen = ({ navigation }) => {
  const [email, setEmail] = useState(""); // Estado para el correo electrónico del usuario
  const [password, setPassword] = useState(""); // Estado para la contraseña
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar u ocultar la contraseña

  /**
   * Maneja el proceso de inicio de sesión.
   * - Valida las credenciales del usuario.
   * - Guarda el token y el ID del contenedor en AsyncStorage.
   * - Establece la conexión del socket y navega a la pantalla QR.
   */
  const handleLoging = async () => {
    try {
      const data = await loginContenedor(email, password); // Llama al servicio de autenticación
      console.log("Data: ", data);

      if (data.data.isValid) {
        const token = data.data.token;
        const idContenedor = data.data.idContenedor;

        // Almacena el token y el ID del contenedor localmente
        await AsyncStorage.setItem("userToken", token);
        await AsyncStorage.setItem("idContenedor", String(idContenedor));

        // Conecta al socket utilizando el ID del contenedor
        const socketContenedor = `contenedor-${idContenedor}`;
        console.log("Socket: ", socketContenedor);

        // Conecta el socket utilizando el idContenedor
        // Conecta el socket utilizando el idContenedor y navigation
        connectSocket(socketContenedor, navigation);

        // Navega a la pantalla QR
        navigation.navigate("QR");
      } else {
        // Muestra una alerta si las credenciales son inválidas
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.log("Error de la solicitud: ", error);
      // Muestra una alerta si hay un problema con la solicitud
      Alert.alert(
        "Error",
        "Las credenciales ingresadas son incorrectas o hubo un problema con el servidor"
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Botón para regresar a la pantalla anterior */}
      <View style={styles.containerBack}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>{"<"}</Text>
        </TouchableOpacity>
      </View>

      {/* Título de la pantalla */}
      <Text style={[globalStyles.textBold, styles.title]}>
        ¡Bienvenido de{"\n"}nuevo!
      </Text>

      {/* Campo de entrada para el correo electrónico */}
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu correo"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />

      {/* Contenedor para la contraseña y el botón de visibilidad */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Ingresa tu contraseña"
          placeholderTextColor="#aaa"
          secureTextEntry={!showPassword} // Oculta la contraseña si `showPassword` es false
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye" : "eye-off"} // Cambia el ícono según el estado de visibilidad
            size={24}
            color="#6A707C"
          />
        </TouchableOpacity>
      </View>

      {/* Texto de "Olvidaste tu contraseña" */}
      <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>

      {/* Botón para iniciar sesión */}
      <TouchableOpacity style={styles.button} onPress={handleLoging}>
        <Text style={[globalStyles.textBold, styles.buttonText]}>
          Iniciar Sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  containerBack: {
    marginTop: 50,
    width: 50,
    height: 50,
    borderColor: "#E8ECF4",
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 24,
    color: "#1E232C",
  },
  title: {
    fontSize: 40,
    color: "#0033cc",
    marginTop: 30,
    marginBottom: 40,
  },
  input: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  inputPassword: {
    flex: 1,
    padding: 15,
  },
  forgotPasswordText: {
    alignSelf: "flex-end",
    color: "#6A707C",
    marginTop: 15,
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#0033cc",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default WelcomeScreen;
