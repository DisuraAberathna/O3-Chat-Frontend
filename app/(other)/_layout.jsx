import { Stack } from "expo-router";

export default function OtherLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="chat" />
            <Stack.Screen name="help" />
            <Stack.Screen name="new-chat" />
            <Stack.Screen name="verify" />
        </Stack>
    );
}
