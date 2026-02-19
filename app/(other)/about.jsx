import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import PrimaryHeader from '@/components/PrimaryHeader';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import images from '@/constants/images';

const About = () => {
    const colorScheme = useColorScheme();

    return (
        <SafeAreaView
            edges={["top", "left", "right"]}
            style={[styles.container, colorScheme === 'dark' ? styles.darkContainer : styles.lightContainer]}
        >
            <PrimaryHeader
                title="About"
                menu={false}
                back={true}
                backPress={() => router.back()}
            />
            <View
                style={[
                    { flex: 1 },
                    colorScheme === "dark"
                        ? styles.darkContentView
                        : styles.lightContentView,
                ]}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={[styles.card, colorScheme === 'dark' ? styles.darkView : styles.lightView]}>
                        <View style={styles.header}>
                            <Image
                                source={images.logo}
                                style={styles.logo}
                                contentFit="contain"
                            />
                            <Text style={[styles.appName, colorScheme === 'dark' ? styles.darkText : styles.lightText]}>
                                O3 Chat
                            </Text>
                            <Text style={[styles.version, { opacity: 0.6 }, colorScheme === 'dark' ? styles.darkText : styles.lightText]}>
                                Version 1.0.0 (Stable)
                            </Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, colorScheme === 'dark' ? styles.darkText : styles.lightText]}>
                                Our Mission
                            </Text>
                            <Text style={[styles.description, colorScheme === 'dark' ? styles.darkText : styles.lightText]}>
                                O3 Chat is designed to provide a seamless, secure, and fast messaging experience. We believe in privacy and simplicity, allowing you to connect with friends and family without distractions.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, colorScheme === 'dark' ? styles.darkText : styles.lightText]}>
                                Features
                            </Text>
                            <Text style={[styles.description, colorScheme === 'dark' ? styles.darkText : styles.lightText]}>
                                • Real-time messaging with WebSocket support{"\n"}
                                • Image sharing and instant previews{"\n"}
                                • Customizable profiles and user presence{"\n"}
                                • Reply and message management logic{"\n"}
                                • Dark/Light mode support for eye comfort
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, colorScheme === 'dark' ? styles.darkText : styles.lightText]}>
                                Developer Information
                            </Text>
                            <Text style={[styles.description, colorScheme === 'dark' ? styles.darkText : styles.lightText]}>
                                Developed with ❤️ by Disura Aberathna and the O3 Chat Team. Built using React Native, Expo, and Spring Boot for a robust cross-platform experience.
                            </Text>
                        </View>

                        <View style={styles.footer}>
                            <Text style={[styles.copyright, { opacity: 0.5 }, colorScheme === 'dark' ? styles.darkText : styles.lightText]}>
                                © 2026 O3 Chat. All Rights Reserved.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    darkContainer: {
        backgroundColor: '#000',
    },
    lightContainer: {
        backgroundColor: '#fff',
    },
    darkContentView: {
        backgroundColor: "#111827",
    },
    lightContentView: {
        backgroundColor: "#e2e8f0",
    },
    content: {
        padding: 16,
    },
    card: {
        padding: 24,
        borderRadius: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    darkView: {
        backgroundColor: "#000",
    },
    lightView: {
        backgroundColor: "#fff",
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 12,
    },
    appName: {
        fontSize: 28,
        fontWeight: '800',
        fontFamily: 'snap-itc', // Using the app's signature font
    },
    version: {
        fontSize: 14,
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(150, 150, 150, 0.2)',
        marginVertical: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
        color: "#0c4eac", // Matching app's primary blue
    },
    description: {
        fontSize: 15,
        lineHeight: 22,
        opacity: 0.8,
    },
    footer: {
        alignItems: 'center',
        marginTop: 10,
    },
    copyright: {
        fontSize: 12,
        textAlign: 'center',
    },
    darkText: {
        color: '#fff',
    },
    lightText: {
        color: '#000',
    },
});

export default About;
