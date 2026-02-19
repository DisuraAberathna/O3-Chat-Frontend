import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";

const ImageView = () => {
    const { uri, name } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme();

    return (
        <SafeAreaView style={[styles.container, colorScheme === 'dark' ? styles.dark : styles.light]}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace("home");
                        }
                    }}
                >
                    <Ionicons name="arrow-back" size={24} color={colorScheme === 'dark' ? "#fff" : "#000"} />
                </TouchableOpacity>
                <Text
                    style={[styles.headerText, colorScheme === 'dark' ? styles.darkText : styles.lightText]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {name || "View Image"}
                </Text>
            </View>

            <View style={styles.imageContainer}>
                <Image
                    source={{ uri }}
                    style={styles.image}
                    contentFit="contain"
                    cachePolicy="none"
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    dark: {
        backgroundColor: "#000",
    },
    light: {
        backgroundColor: "#fff",
    },
    backButton: {
        padding: 10,
        borderRadius: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(150, 150, 150, 0.2)',
    },
    headerText: {
        fontSize: 18,
        fontWeight: "600",
        marginLeft: 10,
        flex: 1,
    },
    darkText: {
        color: "#fff",
    },
    lightText: {
        color: "#000",
    },
    imageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: "100%",
    },
});

export default ImageView;
