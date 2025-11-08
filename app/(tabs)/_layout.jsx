import {Tabs} from "expo-router";
import React from "react";
import {useColorScheme} from "@/hooks/useColorScheme";
import icons from "@/constants/icons";
import {StyleSheet, Text, View} from "react-native";
import {Image} from "expo-image";

const TabIcon = ({icon, color, name, focused}) => {
    return (
        <View style={styleSheat.view}>
            <Image
                source={icon}
                tintColor={color}
                style={styleSheat.icon}
                contentFit="contain"
            />
            <Text
                style={[
                    styleSheat.iconText,
                    {color: color},
                    focused && {fontWeight: "600"},
                ]}
            >
                {name}
            </Text>
        </View>
    );
};

const styleSheat = StyleSheet.create({
    view: {
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
        rowGap: 4,
    },
    icon: {
        width: 28,
        height: 28,
    },
    iconText: {
        fontSize: 12,
        lineHeight: 10,
        fontWeight: "500",
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
                    backgroundColor: colorScheme === "dark" ? "#000000" : "#FFFFFF",
                    borderTopWidth: 1,
                    borderTopColor: colorScheme === "dark" ? "#0F172A" : "#E2E8F0",
                    height: 60,
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({color, focused}) => (
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
                    tabBarIcon: ({color, focused}) => (
                        <TabIcon
                            icon={icons.profile}
                            color={color}
                            name="Profile"
                            focused={focused}
                        />
                    ),
                }}
            />
        </Tabs>
    );
};

export default TabLayout;
