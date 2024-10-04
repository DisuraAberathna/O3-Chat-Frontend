import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NewChatBox from "@/components/NewChatBox";
import PrimaryHeader from "@/components/PrimaryHeader";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useState } from "react";
import { FlashList } from "@shopify/flash-list";

const newChat = () => {
  const colorScheme = useColorScheme();
  const { back } = useLocalSearchParams();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const [searchFieldVisibility, setSearchFieldVisibility] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");

  const MenuItems = [
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

  useEffect(() => {
    loadUsers();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      loadUsers();
      setRefreshing(false);
    }, 2000);
  }, []);

  const loadUsers = async () => {
    setIsLoaded(false);
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
            setUsers(data.groupedUsers);
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
        title="New Chat"
        back={true}
        backPress={() => {
          router.replace(back);
        }}
        menu={true}
        menuItems={MenuItems}
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
          {Object.keys(users).length !== 0 ? (
            <>
              {Object.keys(users).map((letter) => (
                <FlashList
                  data={users[letter]}
                  renderItem={({ item }) => {
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
                  ListHeaderComponent={
                    <Text
                      style={[
                        styleSheat.listHeaderText,
                        colorScheme === "dark"
                          ? styleSheat.darkText
                          : styleSheat.lightText,
                      ]}
                    >
                      {letter}
                    </Text>
                  }
                  ListHeaderComponentStyle={styleSheat.listHeader}
                  estimatedItemSize={200}
                  refreshing={true}
                  showsVerticalScrollIndicator={true}
                  contentContainerStyle={styleSheat.mainView}
                  keyExtractor={(item) => item.id}
                  key={letter}
                />
              ))}
            </>
          ) : (
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
                style={[
                  styleSheat.listHeaderText,
                  colorScheme === "dark"
                    ? styleSheat.darkText
                    : styleSheat.lightText,
                ]}
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

export default newChat;

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
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  listHeader: {
    marginBottom: 4,
    paddingLeft: 4,
  },
  listHeaderText: {
    fontSize: 16,
  },
  darkText: {
    color: "#fff",
  },
  lightText: {
    color: "#000",
  },
  loadView: {
    padding: 12,
  },
  darkView: {
    backgroundColor: "#000",
  },
  lightView: {
    backgroundColor: "#fff",
  },
});
