import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import * as SystemUI from 'expo-system-ui';

import { AlertProvider } from "@/components/AlertProvider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        "snap-itc": require("@/assets/fonts/snap-itc.ttf"),
    });

    colorScheme === "dark" && SystemUI.setBackgroundColorAsync('transparent');

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <AlertProvider>
                <Stack>
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="(other)" options={{ headerShown: false }} />
                </Stack>
                <StatusBar
                    style={colorScheme === "dark" ? "light" : "dark"}
                    backgroundColor="transparent"
                    translucent={true}
                />
            </AlertProvider>
        </ThemeProvider>
    );
}
