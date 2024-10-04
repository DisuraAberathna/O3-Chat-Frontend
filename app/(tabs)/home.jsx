import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import PrimaryHeader from "@/components/PrimaryHeader";
import MessageBox from "@/components/MessageBox";
import { View } from "react-native";
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { FlashList } from "@shopify/flash-list";

const home = () => {
  const colorScheme = useColorScheme();
  const [searchFieldVisibility, setSearchFieldVisibility] = useState(false);

  const MenuItems = [
    {
      title: "New Chat",
      handlePress: () => {
        router.replace({
          pathname: "/new-chat",
          params: { back: "/home" },
        });
      },
    },
    {
      title: "Search",
      handlePress: () => {
        setSearchFieldVisibility(true);
      },
    },
    {
      title: "Help",
      handlePress: () => {
        router.replace({
          pathname: "/help",
          params: { back: "/home" },
        });
      },
    },
    {
      title: "Sign Out",
      handlePress: async () => {
        AsyncStorage.removeItem("user");
        router.replace("sign-in");
      },
    },
  ];

  const hideSearch = () => {
    setSearchFieldVisibility(false);
  };

  const users = [
    {
      id: 1,
    },
    {
      id: 2,
    },
  ];

  return (
    <SafeAreaView
      style={
        colorScheme === "dark" ? styleSheat.darkView : styleSheat.lightView
      }
    >
      <PrimaryHeader
        title="O3 Chat"
        menu={true}
        menuItems={MenuItems}
        searchFieldVisibility={searchFieldVisibility}
        closeOnPress={hideSearch}
      />
      <FlashList
        data={users}
        renderItem={({ item }) => {
          return <MessageBox id={item.id} />;
        }}
        estimatedItemSize={200}
        refreshing={true}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styleSheat.mainView}
      />
    </SafeAreaView>
  );
};

export default home;

const styleSheat = StyleSheet.create({
  darkView: {
    flex: 1,
    backgroundColor: "#111827",
  },
  lightView: {
    flex: 1,
    backgroundColor: "#e2e8f0",
  },
  mainView: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});
