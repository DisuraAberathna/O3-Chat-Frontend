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

const NewChat = () => {
  const colorScheme = useColorScheme();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const [searchFieldVisibility, setSearchFieldVisibility] = useState(false);
  const [users, setUsers] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");

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
        router.replace("sign-in");
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
    loadUsers().then(() => setRefreshing(false));
  }, [searchText]);

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

        const response = await fetch(`${apiUrl}/O3-Chat/LoadUsers`, {
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
            setUsers(data.users);
          } else {
            Alert.alert("Warning", data.msg);
          }
        } else {
          Alert.alert("Error", "Loading failed \nCannot process this request!");
        }
      } else {
        router.replace("sign-in");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An unexpected error occurred.");
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
        users ? (
          <FlashList
            data={users}
            renderItem={({item}) => {
              return (
                <NewChatBox
                  data={{
                    id: item.id,
                    name: item.name,
                    bio: item.bio,
                    image: item.profile_img,
                  }}
                />
              );
            }}
            keyExtractor={(item) => item.id}
            estimatedItemSize={100}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.mainView}
          />
        ) : (
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
        )
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
    backgroundColor: "#111827",
  },
  lightMainView: {
    flex: 1,
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
