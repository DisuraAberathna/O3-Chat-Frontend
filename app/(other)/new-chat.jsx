import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NewChatBox from "@/components/NewChatBox";
import PrimaryHeader from "@/components/PrimaryHeader";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FlashList } from "@shopify/flash-list";
import { useAppAlert } from "@/components/AlertProvider";
// import { demoUsers } from "../../constants/demoData";

const NewChat = () => {
  const colorScheme = useColorScheme();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const [searchFieldVisibility, setSearchFieldVisibility] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [imageVersion, setImageVersion] = useState(Date.now());

  const { showAlert } = useAppAlert();

  const menuItems = [
    {
      title: "Search",
      handlePress: () => {
        setSearchFieldVisibility(true);
      },
    },
    {
      title: "Help",
      handlePress: () => {
        router.push("help");
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
  }, [searchText]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setImageVersion(Date.now());
    loadUsers().then(() => setRefreshing(false));
  }, [searchText]);

  const loadUsers = async () => {
    try {
      // Get the current user's ID
      const storedData = await AsyncStorage.getItem("user");
      if (!storedData) {
        showAlert("Error", "User session not found", "error");
        return;
      }

      const user = JSON.parse(storedData);
      const userId = user.id;

      const payload = {
        id: userId,
        text: searchText,
      };

      console.log(`Sending Load Users Request: ${JSON.stringify(payload)} to ${apiUrl}/load-users`);

      const response = await fetch(`${apiUrl}/load-users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Load Users Response:`, JSON.stringify(data));

        // Check if the response indicates an error
        if (data.ok === false) {
          showAlert("Error", data.msg || "Failed to load users", "error");
          setUsers([]);
        } else {
          // Extract the users array from the response
          const usersList = data.users || data;
          setUsers(usersList);
        }
      } else {
        const errorText = await response.text();
        console.log(`Load Users Error:`, errorText);
        showAlert("Error", "Failed to load users", "error");
        setUsers([]);
      }
      setIsLoaded(true);
    } catch (error) {
      console.error(error);
      showAlert("Error", "An unexpected error occurred.", "error");
      setIsLoaded(true);
    }
  };

  return (
    <SafeAreaView
      style={
        colorScheme === "dark" ? styles.darkMainView : styles.lightMainView
      }
    >
      <PrimaryHeader
        title="New Chat"
        back={true}
        backPress={() => {
          router.back();
        }}
        menu={true}
        menuItems={menuItems}
        searchFieldVisibility={searchFieldVisibility}
        searchText={searchText}
        setSearchText={setSearchText}
        closeOnPress={hideSearch}
        searchOnPress={loadUsers}
      />
      {isLoaded ? (
        <View
          style={[
            { flex: 1 },
            colorScheme === "dark" ? styles.darkContentView : styles.lightContentView,
          ]}
        >
          <FlashList
            data={users}
            renderItem={({ item }) => {
              return (
                <NewChatBox
                  data={{
                    id: item.id,
                    name: item.name,
                    bio: item.bio,
                    image: item.profile_img,
                    imageVersion: imageVersion,
                  }}
                />
              );
            }}
            keyExtractor={(item) => item.id.toString()}
            estimatedItemSize={100}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.mainView}
            ListEmptyComponent={
              <View
                style={[
                  styles.emptyView,
                  colorScheme === "dark" ? styles.darkView : styles.lightView,
                ]}
              >
                <Text
                  style={[
                    styles.listHeaderText,
                    colorScheme === "dark" ? styles.darkText : styles.lightText,
                  ]}
                >
                  Result not found for '{searchText}'
                </Text>
              </View>
            }
          />
        </View>
      ) : (
        <View style={styles.loadView}>
          <ActivityIndicator size={"large"} color={"#0C4EAC"} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default NewChat;

const styles = StyleSheet.create({
  darkMainView: {
    flex: 1,
    backgroundColor: "#000000",
  },
  lightMainView: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  darkContentView: {
    backgroundColor: "#111827",
  },
  lightContentView: {
    backgroundColor: "#e2e8f0",
  },
  mainView: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  darkText: {
    color: "#fff",
  },
  lightText: {
    color: "#000",
  },
  loadView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyView: {
    paddingHorizontal: 12,
    paddingVertical: 18,
    margin: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  darkView: {
    backgroundColor: "#000",
  },
  lightView: {
    backgroundColor: "#fff",
  },
  listHeaderText: {
    fontSize: 16,
  },
});
