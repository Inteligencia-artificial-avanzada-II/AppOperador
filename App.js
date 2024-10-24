// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/LoginScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import WaitingScreen from "./src/screens/WaitingScreen";
import GoToScreen from "./src/screens/GoToScreen";
import UnloadingScreen from "./src/screens/UnloadingScreen";
import UnloadedScreen from "./src/screens/UnloadedScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Waiting" component={WaitingScreen} />
        <Stack.Screen name="GoTo" component={GoToScreen} />
        <Stack.Screen name="Unloading" component={UnloadingScreen} />
        <Stack.Screen name="Unloaded" component={UnloadedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
