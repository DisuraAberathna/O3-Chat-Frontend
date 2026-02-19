import { Tabs } from "expo-router";
import React from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import icons from "@/constants/icons";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";

const TabIcon = ({ icon, color, name, focused }) => {
    return (
        <View style={styleSheat.view}>
            <Image
                source={icon}
                tintColor={color}
                style={styleSheat.icon}
                contentFit="contain"
            />
        </View>
    );
};

const styleSheat = StyleSheet.create({
    view: {
        alignItems: "center",
        justifyContent: "center",
        width: 80,
        height: 85,
        paddingTop: 40,
        paddingBottom: 10,
    },
    icon: {
        width: 26,
        height: 26,
    },
    iconText: {
        fontSize: 12,
        fontWeight: "500",
        marginTop: 4,
    },
});

const TabLayout = () => {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarActiveTintColor: "#0C4EAC",
                tabBarInactiveTintColor: colorScheme === "dark" ? "#FFFFFF" : "#000000",
                tabBarStyle: {
                    backgroundColor: colorScheme === "dark" ? "#000" : "#FFFFFF",
                    borderTopWidth: 1,
                    borderTopColor: colorScheme === "dark" ? "#0F172A" : "#E2E8F0",
                    height: 85,
                    paddingBottom: 0,
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            icon={icons.home}
                            color={color}
                            name="Home"
                            focused={focused}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            icon={icons.profile}
                            color={color}
                            name="Profile"
                            focused={focused}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            icon={icons.gear}
                            color={color}
                            name="Settings"
                            focused={focused}
                        />
                    ),
                }}
            />
        </Tabs>
    );
};

export default TabLayout;
