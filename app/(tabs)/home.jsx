import React, { useCallback, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import PrimaryHeader from "@/components/PrimaryHeader";
import MessageBox from "@/components/MessageBox";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useAppAlert } from "@/components/AlertProvider";
import { router, useFocusEffect } from "expo-router";
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
  const { showAlert } = useAppAlert();

  const [users, setUsers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [imageVersion, setImageVersion] = useState(Date.now());

  const menuItems = [
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

  const ws = React.useRef(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      const storedData = await AsyncStorage.getItem("user");
      if (storedData) {
        const u = JSON.parse(storedData);
        setUser(u);
      } else {
        router.replace("sign-in");
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (user) {
      const wsUrl = apiUrl.replace("http", "ws") + `/chat/${user.id}`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("Connected to WebSocket (Home)");
        loadUsers();
      };

      ws.current.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.type === "chat_list") {
            setUsers(data.chatList);
            setIsLoaded(true);
          } else if (data.type === "message") {
            setUsers(prevUsers => {
              const list = [...prevUsers];
              const otherId = (data.from_id == user.id && data.to_id == user.id)
                ? user.id
                : (data.from_id == user.id ? data.to_id : data.from_id);

              const index = list.findIndex(u => u.id == otherId);
              let updatedItem;

              if (index !== -1) {
                updatedItem = { ...list[index] };
                list.splice(index, 1);
              } else {
                updatedItem = {
                  id: otherId,
                  name: data.from?.f_name ? (data.from.f_name + " " + data.from.l_name) : "New Message",
                  profile_img: data.from?.profile_url || null,
                  bio: data.from?.bio || "",
                  count: 0
                };
              }

              updatedItem.msg = data.message && data.message.trim() !== "" ? data.message : (data.image ? "Image" : "");
              updatedItem.time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              updatedItem.view = (data.from_id == user.id && data.to_id != user.id);

              if (data.from_id != user.id) {
                updatedItem.count = (updatedItem.count || 0) + 1;
              }

              if (data.status_id) updatedItem.status = data.status_id;
              else if (data.status) updatedItem.status = data.status;
              else updatedItem.status = 2;

              list.unshift(updatedItem);
              return list;
            });
          } else if (data.type === "seen") {
            setUsers(prevUsers => {
              const list = [...prevUsers];

              const otherId = data.seen_by == user.id ? data.from_id : data.seen_by;

              const index = list.findIndex(u => u.id == otherId);
              if (index !== -1) {
                const item = list[index];
                if (data.seen_by == user.id) {
                  list[index] = { ...item, count: 0 };
                } else if (item.view) {
                  list[index] = { ...item, status: 3 };
                }
                return list;
              }
              return list;
            });
          }
        } catch (error) {
          console.error("WS Parse Error", error);
        }
      };

      ws.current.onclose = () => {
        console.log("WebSocket Disconnected (Home)");
      };

      ws.current.onerror = (e) => {
        console.log("WebSocket Error", e.message);
      };

      return () => {
        if (ws.current) ws.current.close();
      };
    }
  }, [user]);



  const loadUsers = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: "load_chats",
        searchText: ""
      }));
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [user])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setImageVersion(Date.now());
    loadUsers();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [user]);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={
        colorScheme === "dark"
          ? styleSheat.darkMainView
          : styleSheat.lightMainView
      }
    >
      <PrimaryHeader
        title="O3 Chat"
        menu={false}
        menuItems={menuItems}
        searchFieldVisibility={true}
        searchText={searchText}
        setSearchText={setSearchText}
        searchOnPress={() => { }}
      />
      <View
        style={[
          { flex: 1 },
          colorScheme === "dark"
            ? styleSheat.darkContentView
            : styleSheat.lightContentView,
        ]}
      >
        {isLoaded ? (
          <FlashList
            data={filteredUsers}
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
                    imageVersion: imageVersion,
                  }}
                />
              );
            }}
            estimatedItemSize={50}
            refreshing={refreshing}
            onRefresh={onRefresh}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
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
            ListFooterComponent={
              filteredUsers.length === 0 && searchText.length !== 0 ? (
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
              ) : null
            }
          />
        ) : (
          <View style={styleSheat.loadView}>
            <ActivityIndicator size={"large"} color={"#0C4EAC"} />
          </View>
        )}
        <TouchableOpacity
          style={styleSheat.fab}
          onPress={() => {
            router.push({
              pathname: "new-chat",
              params: { back: "home" },
            });
          }}
          activeOpacity={0.7}
        >
          <Image
            source={icons.plus}
            contentFit="contain"
            style={{ width: 30, height: 30, tintColor: "#fff" }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default home;

const styleSheat = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0C4EAC",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10
  },
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
