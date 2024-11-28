import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import globalStyles from "../globalStyles";
import { Ionicons } from "@expo/vector-icons";
import { loginContenedor } from "../services/AuthService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connectSocket } from "../services/socket"; // Importa la función para conectar el socket

const WelcomeScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLoging = async () => {
    try {
      const data = await loginContenedor(email, password);
      console.log("Data: ", data);

      if (data.data.isValid) {
        console.log("Token: ", data.data.token);
        const token = data.data.token;
        const idContenedor = data.data.idContenedor;

        // Guarda el token y el idContenedor en AsyncStorage
        await AsyncStorage.setItem("userToken", token);
        await AsyncStorage.setItem("idContenedor", String(idContenedor));

        const socketContenedor = String("contenedor-" + idContenedor);
        console.log("Socket: ", socketContenedor);

        // Conecta el socket utilizando el idContenedor
        // Conecta el socket utilizando el idContenedor y navigation
        connectSocket(socketContenedor, navigation);

        // Navega a la pantalla QR
        navigation.navigate("QR");
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.log("Error de la solicitud: ", error);
      Alert.alert(
        "Error",
        "Las credenciales ingresadas son incorrectas o hubo un problema con el servidor"
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerBack}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>{"<"}</Text>
        </TouchableOpacity>
      </View>
      <Text style={[globalStyles.textBold, styles.title]}>
        ¡Bienvenido de{"\n"}nuevo!
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Ingresa tu correo"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Ingresa tu contraseña"
          placeholderTextColor="#aaa"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={24}
            color="#6A707C"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>

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
