import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PasswordStrength = ({ password }) => {
    if (!password) {
        return null;
    }

    const getStrength = (pass) => {
        let score = 0;
        if (pass.length > 5) score++;
        if (pass.length > 7) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        return score;
    };

    const score = getStrength(password);

    let strengthLabel = "Weak";
    let strengthColor = "#ef4444"; // red
    let width = "33%";

    if (score >= 4) {
        strengthLabel = "Strong";
        strengthColor = "#22c55e"; // green
        width = "100%";
    } else if (score >= 2) {
        strengthLabel = "Medium";
        strengthColor = "#eab308"; // yellow
        width = "66%";
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>Password Strength: </Text>
                <Text style={[styles.strength, { color: strengthColor }]}>
                    {strengthLabel}
                </Text>
            </View>
            <View style={styles.track}>
                <View style={[styles.bar, { width: width, backgroundColor: strengthColor }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 12,
        width: "100%",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    label: {
        fontSize: 14,
        color: "#6b7280",
    },
    strength: {
        fontSize: 14,
        fontWeight: "600",
    },
    track: {
        height: 4,
        backgroundColor: "#e5e7eb",
        borderRadius: 2,
        overflow: "hidden",
    },
    bar: {
        height: "100%",
        borderRadius: 2,
    }
});

export default PasswordStrength;
