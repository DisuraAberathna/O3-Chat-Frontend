import React from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";

const { width } = Dimensions.get("window");

const CustomAlert = ({
    visible,
    title,
    message,
    onClose,
    type = "info", // info, success, error, warning
    confirmText = "OK",
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const getIconColor = () => {
        switch (type) {
            case "success":
                return "#10B981";
            case "error":
                return "#EF4444";
            case "warning":
                return "#F59E0B";
            default:
                return "#0C4EAC";
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View
                    style={[
                        styles.alertContainer,
                        isDark ? styles.darkContainer : styles.lightContainer,
                    ]}
                >
                    {title && (
                        <View style={styles.header}>
                            <View style={[styles.indicator, { backgroundColor: getIconColor() }]} />
                            <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>
                                {title}
                            </Text>
                        </View>
                    )}

                    <View style={styles.body}>
                        <Text style={[styles.message, isDark ? styles.darkSubText : styles.lightSubText]}>
                            {message}
                        </Text>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: getIconColor() }]}
                            onPress={onClose}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CustomAlert;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    alertContainer: {
        width: width * 0.85,
        maxWidth: 400,
        borderRadius: 24,
        padding: 24,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    lightContainer: {
        backgroundColor: "#FFFFFF",
    },
    darkContainer: {
        backgroundColor: "#1F2937",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    indicator: {
        width: 4,
        height: 20,
        borderRadius: 2,
        marginRight: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    body: {
        marginBottom: 24,
    },
    message: {
        fontSize: 16,
        lineHeight: 24,
    },
    footer: {
        alignItems: "flex-end",
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        minWidth: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    lightText: {
        color: "#111827",
    },
    darkText: {
        color: "#F9FAFB",
    },
    lightSubText: {
        color: "#4B5563",
    },
    darkSubText: {
        color: "#9CA3AF",
    },
});
