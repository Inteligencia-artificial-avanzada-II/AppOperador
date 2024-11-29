import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import globalStyles from "../globalStyles"; // Importa estilos globales para el texto

/**
 * Componente principal para la pantalla de inicio de sesión.
 * @param {Object} navigation - Objeto de navegación proporcionado por React Navigation.
 */
const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Fondo de la pantalla con una imagen */}
      <ImageBackground
        source={require("../../assets/background.jpg")} // Ruta de la imagen de fondo
        style={styles.backgroundImage}
      >
        {/* Superposición oscura para mejorar la visibilidad del contenido */}
        <View style={styles.overlay} />

        {/* Contenedor principal del área de inicio de sesión */}
        <View style={styles.loginContainer}>
          {/* Logo de la aplicación */}
          <Image
            source={require("../../assets/bimboLogo.png")} // Ruta del logo
            style={styles.logo}
          />
          {/* Botón para iniciar sesión */}
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.6} // Reduce la opacidad al presionar
            onPress={() => navigation.navigate("Welcome")} // Navega a la pantalla de bienvenida
          >
            <Text style={[globalStyles.textBold, styles.buttonText]}>
              Iniciar Sesión
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  loginContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    alignItems: "center",
    padding: 5,
    height: "30%",
  },
  logo: {
    width: 169,
    height: 140,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#001789",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoginScreen; // Exporta el componente para ser usado en el stack de navegación
