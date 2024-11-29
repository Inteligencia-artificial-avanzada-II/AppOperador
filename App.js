// Importación de dependencias necesarias
import React from "react"; // Biblioteca principal para construir interfaces de usuario
import { NavigationContainer } from "@react-navigation/native"; // Contenedor principal para la navegación
import { createStackNavigator } from "@react-navigation/stack"; // Creador de pila para navegación entre pantallas

// Importación de las pantallas de la aplicación
import LoginScreen from "./src/screens/LoginScreen"; // Pantalla de inicio de sesión
import WelcomeScreen from "./src/screens/WelcomeScreen"; // Pantalla de bienvenida
import WaitingScreen from "./src/screens/WaitingScreen"; // Pantalla de espera
import GoToScreen from "./src/screens/GoToScreen"; // Pantalla de dirección a una ubicación
import UnloadingScreen from "./src/screens/UnloadingScreen"; // Pantalla de descarga en progreso
import UnloadedScreen from "./src/screens/UnloadedScreen"; // Pantalla después de completar la descarga
import QRScan from "./src/screens/QRScanScreen"; // Pantalla para escanear códigos QR

// Creación del stack navigator
const Stack = createStackNavigator();
import { navigationRef } from "./src/services/navigationService";

/**
 * Componente principal de la aplicación.
 * Configura la navegación entre las pantallas usando un Stack Navigator.
 */
export default function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Definición de las pantallas y su orden de navegación */}
        <Stack.Screen name="Login" component={LoginScreen} /> {/* Pantalla de inicio de sesión */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} /> {/* Pantalla de bienvenida */}
        <Stack.Screen name="QR" component={QRScan} /> {/* Pantalla de escaneo de QR */}
        <Stack.Screen name="Waiting" component={WaitingScreen} /> {/* Pantalla de espera */}
        <Stack.Screen name="GoTo" component={GoToScreen} /> {/* Pantalla de navegación hacia una puerta */}
        <Stack.Screen name="Unloading" component={UnloadingScreen} /> {/* Pantalla de proceso de descarga */}
        <Stack.Screen name="Unloaded" component={UnloadedScreen} /> {/* Pantalla después de completar la descarga */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
