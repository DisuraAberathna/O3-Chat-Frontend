import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import React from "react";

import { useColorScheme } from "@/hooks/useColorScheme";

const AuthLayout = () => {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="register-form-1" options={{ headerShown: false }} />
        <Stack.Screen name="register-form-2" options={{ headerShown: false }} />
      </Stack>
      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
        backgroundColor={colorScheme === "dark" ? "#111827" : "#e2e8f0"}
        translucent={false}
      />
    </ThemeProvider>
  );
};

export default AuthLayout;
