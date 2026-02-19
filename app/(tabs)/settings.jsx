import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import PrimaryHeader from '@/components/PrimaryHeader';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import icons from '@/constants/icons';

const Settings = () => {
    const colorScheme = useColorScheme();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const menuItems = [
        {
            title: "Help",
            handlePress: () => {
                router.push({
                    pathname: "help",
                    params: { back: "settings" },
                });
            },
        },
    ];


    const handleSignOut = async () => {
        await AsyncStorage.removeItem("user");
        router.replace("/");
    };

    const SettingItem = ({ title, icon, onPress, value, type }) => (
        <TouchableOpacity
            style={[styles.settingItem, colorScheme === 'dark' ? styles.darkItem : styles.lightItem]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.settingLeft}>
                {icon && (
                    <Image
                        source={icon}
                        contentFit="contain"
                        style={[
                            styles.icon,
                            { tintColor: colorScheme === "dark" ? "#fff" : "#0C4EAC" },
                        ]}
                    />
                )}
                <Text style={[styles.settingText, colorScheme === 'dark' ? styles.darkText : styles.lightText]}>
                    {title}
                </Text>
            </View>
            {type === 'switch' ? (
                <Switch
                    value={value}
                    onValueChange={onPress}
                    trackColor={{ false: "#767577", true: "#0C4EAC" }}
                    thumbColor={value ? "#fff" : "#f4f3f4"}
                />
            ) : (
                <Image
                    source={icons.back} // Using back icon rotated or similar? Or just chevron. 
                    // reusing back icon but rotated 180 deg for "forward"
                    style={[styles.chevron, { tintColor: colorScheme === 'dark' ? '#6b7280' : '#9ca3af', transform: [{ rotate: '180deg' }] }]}
                    contentFit="contain"
                />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView
            edges={["top", "left", "right"]}
            style={[styles.container, colorScheme === 'dark' ? styles.darkContainer : styles.lightContainer]}
        >
            <PrimaryHeader
                title="Settings"
                menu={false}
                back={false}
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

                    <View style={[styles.sectionView, colorScheme === 'dark' ? styles.darkView : styles.lightView]}>
                        <Text style={[styles.sectionTitle, colorScheme === 'dark' ? styles.darkText : styles.lightText]}>General</Text>

                        <SettingItem
                            title="Notifications"
                            icon={null}
                            type="switch"
                            value={notificationsEnabled}
                            onPress={() => setNotificationsEnabled(!notificationsEnabled)}
                        />

                        <SettingItem
                            title="Chat Wallpaper"
                            onPress={() => router.push("wallpaper")}
                        />
                    </View>

                    <View style={[styles.sectionView, colorScheme === 'dark' ? styles.darkView : styles.lightView, { marginTop: 24 }]}>
                        <Text style={[styles.sectionTitle, colorScheme === 'dark' ? styles.darkText : styles.lightText]}>Support</Text>

                        <SettingItem
                            title="Help & Support"
                            onPress={() => router.push({ pathname: "help", params: { back: "settings" } })}
                        />
                        <SettingItem
                            title="About"
                            onPress={() => router.push("about")}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.signOutButton]}
                        onPress={handleSignOut}
                    >
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>

                    <Text style={[styles.versionText, colorScheme === 'dark' ? styles.darkText : styles.lightText]}>
                        Version 1.0.0
                    </Text>

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
    content: {
        padding: 16,
    },
    darkContentView: {
        backgroundColor: "#111827",
    },
    lightContentView: {
        backgroundColor: "#e2e8f0",
    },
    sectionView: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
    },
    darkView: {
        backgroundColor: "#000",
    },
    lightView: {
        backgroundColor: "#fff",
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 12,
        borderBottomWidth: 2,
        borderColor: "#0c4eac",
        alignSelf: 'flex-start'
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    darkItem: {
    },
    lightItem: {
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 15,
    },
    settingText: {
        fontSize: 16,
        fontWeight: '500',
    },
    darkText: {
        color: '#fff',
    },
    lightText: {
        color: '#000',
    },
    chevron: {
        width: 16,
        height: 16,
    },
    signOutButton: {
        marginTop: 40,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ef4444',
    },
    signOutText: {
        color: '#ef4444',
        fontSize: 16,
        fontWeight: '600',
    },
    versionText: {
        textAlign: 'center',
        marginTop: 30,
        opacity: 0.5,
        fontSize: 12,
    }
});

export default Settings;
