import React, { useCallback, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import PrimaryHeader from "@/components/PrimaryHeader";
import MessageBox from "@/components/MessageBox";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import icons from "@/constants/icons";
import PrimaryButton from "@/components/PrimaryButton";

const home = () => {
  const colorScheme = useColorScheme();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const [searchFieldVisibility, setSearchFieldVisibility] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");

  const menuItems = [
    {
      title: "New Chat",
      handlePress: () => {
        router.push({
          pathname: "new-chat",
          params: { back: "home" },
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
        router.push({
          pathname: "help",
          params: { back: "home" },
        });
      },
    },
    {
      title: "Sign Out",
      handlePress: async () => {
        await AsyncStorage.removeItem("user");
        router.replace("/");
      },
    },
  ];

  const hideSearch = () => {
    setSearchFieldVisibility(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    loadUsers();
  }, [searchText]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadUsers();
    setRefreshing(false);
  }, []);

  const loadUsers = async () => {
    if (searchText.length !== 0) {
      setIsLoaded(false);
    }

    const storedData = await AsyncStorage.getItem("user");

    try {
      if (storedData !== null) {
        const user = JSON.parse(storedData);

        const reqObject = {
          id: user.id,
          searchText: searchText,
        };

        const response = await fetch(`${apiUrl}/o3_chat/LoadChatList`, {
          method: "POST",
          body: JSON.stringify(reqObject),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();

          if (data.ok) {
            setIsLoaded(true);
            setUsers(data.chatList);
          } else {
            Alert.alert("Warning", data.msg);
          }
        } else {
          Alert.alert(
            "Error",
            "Loading failed \nCan not process this request!"
          );
        }
      } else {
        router.replace("sign-in");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView
      style={
        colorScheme === "dark"
          ? styleSheat.darkMainView
          : styleSheat.lightMainView
      }
    >
      <PrimaryHeader
        title="O3 Chat"
        menu={true}
        menuItems={menuItems}
        searchFieldVisibility={searchFieldVisibility}
        searchText={searchText}
        setSearchText={setSearchText}
        closeOnPress={hideSearch}
        searchOnPress={loadUsers}
      />
      {isLoaded ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <FlashList
            data={users}
            renderItem={({ item }) => {
              return (
                <MessageBox
                  data={{
                    id: item.id,
                    name: item.name,
                    bio: item.bio,
                    image: item.profile_img,
                    msg: item.msg,
                    time: item.time,
                    status: item.status,
                    view: item.view,
                    count: item.count,
                  }}
                />
              );
            }}
            estimatedItemSize={50}
            refreshing={true}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styleSheat.mainView}
            ListEmptyComponent={
              searchText.length === 0 && (
                <View
                  style={[
                    {
                      paddingHorizontal: 12,
                      paddingVertical: 24,
                      margin: 12,
                      borderRadius: 12,
                      alignItems: "center",
                    },
                    colorScheme === "dark"
                      ? styleSheat.darkView
                      : styleSheat.lightView,
                  ]}
                >
                  <Image
                    source={icons.emptyChat}
                    style={{
                      width: 100,
                      height: 100,
                      tintColor: colorScheme === "dark" ? "#fff" : "#0C4EAC",
                    }}
                  />
                  <Text
                    style={[
                      {
                        fontSize: 24,
                        lineHeight: 28,
                        fontWeight: "500",
                      },
                      colorScheme === "dark"
                        ? styleSheat.darkText
                        : styleSheat.lightText,
                    ]}
                  >
                    No Chats Yet
                  </Text>
                  <PrimaryButton
                    title="Start Chat"
                    handlePress={() => {
                      router.push("new-chat");
                    }}
                    containerStyles={{ marginTop: 12, width: "50%" }}
                  />
                </View>
              )
            }
          />
          {users.length === 0 && searchText.length !== 0 && (
            <View
              style={[
                {
                  paddingHorizontal: 12,
                  paddingVertical: 18,
                  margin: 12,
                  borderRadius: 12,
                  alignItems: "center",
                },
                colorScheme === "dark"
                  ? styleSheat.darkView
                  : styleSheat.lightView,
              ]}
            >
              <Text
                style={
                  colorScheme === "dark"
                    ? styleSheat.darkText
                    : styleSheat.lightText
                }
              >
                Result not fount for '{searchText}'
              </Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styleSheat.loadView}>
          <ActivityIndicator size={"large"} color={"#0C4EAC"} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default home;

const styleSheat = StyleSheet.create({
  darkMainView: {
    flex: 1,
    backgroundColor: "#111827",
  },
  lightMainView: {
    flex: 1,
    backgroundColor: "#e2e8f0",
  },
  mainView: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  loadView: {
    padding: 12,
  },
  darkText: {
    color: "#fff",
  },
  lightText: {
    color: "#000",
  },
  darkView: {
    backgroundColor: "#000",
  },
  lightView: {
    backgroundColor: "#fff",
  },
});
