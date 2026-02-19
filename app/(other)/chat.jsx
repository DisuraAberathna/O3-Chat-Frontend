import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAppAlert } from "@/components/AlertProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import SecondaryHeader from "@/components/SecondaryHeader";
import { router, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Image } from "expo-image";
import icons from "@/constants/icons";
import Message from "../../components/Message";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { uploadToImgBB } from "../../utils/imgbb";
import * as Progress from 'react-native-progress';

const Chat = () => {
  const colorScheme = useColorScheme();
  const { id, name, image, bio } = useLocalSearchParams();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { showAlert } = useAppAlert();
  const flashListRef = useRef(null);

  const [focusedInput, setFocusedInput] = useState(false);
  const [reply, setReply] = useState(0);
  const [msgImage, setMsgImage] = useState(null);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [replyData, setReplyData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [load, setLoad] = useState(true);
  const [imageVersion, setImageVersion] = useState(Date.now());
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [wallpaperColor, setWallpaperColor] = useState(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isNearBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 200;
    setShowScrollToBottom(!isNearBottom);
  };

  const wallPaperMapping = {
    'default': null,
    'soft-blue': '#e0f2fe',
    'soft-green': '#dcfce7',
    'soft-rose': '#ffe4e6',
    'soft-amber': '#fef3c7',
    'classic-whatsapp': '#ece5dd',
    'dark-grey': '#1f2937',
    'dark-blue': '#1e3a8a',
    'dark-green': '#064e3b',
    'dark-purple': '#4c1d95',
    'dark-charcoal': '#111827',
  };

  useEffect(() => {
    const getWallpaper = async () => {
      const key = colorScheme === 'dark' ? 'chat_wallpaper_dark' : 'chat_wallpaper_light';
      const saved = await AsyncStorage.getItem(key);
      if (saved && wallPaperMapping[saved]) {
        setWallpaperColor(wallPaperMapping[saved]);
      } else {
        setWallpaperColor(null);
      }
    };
    getWallpaper();
  }, [colorScheme]);

  const menuItems = [
    {
      title: "Delete Chat",
      handlePress: async () => {
        if (user !== null) {
          const reqObject = {
            loggedInId: user.id,
            otherId: id,
          };

          try {
            const response = await fetch(`${apiUrl}/delete-chat`, {
              method: "POST",
              body: JSON.stringify(reqObject),
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (response.ok) {
              const data = await response.json();

              if (data.ok) {
                setLoad(true);
              } else {
                showAlert("Warning", data.msg, "warning");
              }
            } else {
              showAlert(
                "Error",
                "Chat deleting failed \nCan not process this request!",
                "error"
              );
            }
          } catch (error) {
            console.error(error);
          }
        } else {
          router.replace("sign-in");
        }
      },
    },
  ];

  useEffect(() => {
    loadChats();
  }, [load]);

  const loadChats = async () => {
    try {
      if (!user) {
        const storedData = await AsyncStorage.getItem("user");
        if (storedData) {
          setUser(JSON.parse(storedData));
        } else {
          router.replace("sign-in");
        }
      } else if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({
          type: "load_chat_history",
          other_id: id
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 0.5,
    });

    if (!result.canceled) {
      setMsgImage(result.assets[0].uri);
    }
  };

  const ws = useRef(null);

  useEffect(() => {
    if (user) {
      const wsUrl = apiUrl.replace("http", "ws") + `/chat/${user.id}`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("Connected to WebSocket");
        ws.current.send(JSON.stringify({
          type: "load_chat_history",
          other_id: id
        }));
      };

      ws.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.type === "chat_history") {
          // Normalize historical data to match message structure
          const normalizedChats = data.chats.map(c => ({
            ...c,
            fromUser: c.from_id, // Ensure fromUser is an ID, not a name
            toUser: c.to_id,
            // Maintain other properties as needed or map them if structure differs
          }));
          setChats(normalizedChats);
          setIsLoaded(true);
          setLoad(false);
        } else if (data.type === "message") {
          const userId = user.id || user._id;
          if (data.from_id == id || data.from_id == userId) {
            const timeString = data.date_time
              ? new Date(data.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const newMessage = {
              id: data.id,
              fromUser: data.from_id,
              toUser: userId,
              msg: data.message,
              img: data.image,
              time: timeString,
              side: data.from_id == userId ? "right" : "left",
              status: data.status_id || 2, // Use provided status or default to delivered
              replyMsg: data.reply ? data.reply.message : null,
              replyUser: data.reply ? data.reply.from_id : null,
            };

            setChats((prevChats) => {
              if (prevChats.some(chat => chat.id === newMessage.id)) {
                return prevChats;
              }
              return [...prevChats, newMessage];
            });

            if (data.from_id == id) {
              ws.current.send(JSON.stringify({
                type: "seen",
                chat_id: data.id
              }));
            }
          }
        } else if (data.type === "seen") {
          const userId = user.id || user._id;
          setChats((prevChats) =>
            prevChats.map((chat) => {
              // Only update if it's my message and the ID matches or is older
              if ((chat.id == data.chat_id || chat.id < data.chat_id) && chat.fromUser == userId) {
                // If it's already seen (3), keep it. Otherwise update to 3.
                return { ...chat, status: 3 };
              }
              return chat;
            })
          );
        } else if (data.type === "ack") {
          setChats((prevChats) =>
            prevChats.map((chat) => {
              // Match by temp_id if available, otherwise fallback (riskier)
              if (data.temp_id && chat.id === data.temp_id) {
                return { ...chat, id: data.chat_id, status: data.status_id || 2 };
              }
              return chat;
            })
          );
        }
      };

      ws.current.onclose = () => {
        console.log("WebSocket Disconnected");
      };

      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
    }
  }, [user, id]);

  const sendMessage = async () => {
    if (user !== null) {
      if (msgImage || message.length !== 0) {
        let uploadedImageUrl = null;
        const tempId = Date.now().toString(); // Generate ID as string for consistency

        if (msgImage) {
          try {
            setIsUploading(true);
            setUploadProgress(0);
            uploadedImageUrl = await uploadToImgBB(msgImage, (progress) => {
              setUploadProgress(progress);
            });
          } catch (error) {
            showAlert("Error", "Failed to upload image", "error");
            setIsUploading(false);
            return;
          } finally {
            setIsUploading(false);
            setUploadProgress(0);
          }
        }

        const payload = {
          type: "send",
          to_id: id,
          message: message,
          reply_id: reply !== 0 ? reply : null,
          image: uploadedImageUrl,
          temp_id: tempId
        };

        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify(payload));

          // Optimistic Update
          const optimisticMsg = {
            id: tempId,
            fromUser: user.id || user._id,
            toUser: id,
            msg: message,
            img: uploadedImageUrl,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            side: "right",
            status: 1,
            replyMsg: replyData.msg,
            replyUser: replyData.user,
          };
          setChats((prev) => [...prev, optimisticMsg]);

          setMessage("");
          setMsgImage(null);
          setReply(0);
          setReplyData({});
          setFocusedInput(false);
        } else {
          showAlert("Error", "Connection lost. Reconnecting...", "error");
        }
      }
    } else {
      router.replace("sign-in");
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setImageVersion(Date.now());
    loadChats();
    setRefreshing(false);
  }, []);

  const goToBottom = () => {
    if (flashListRef.current && chats.length > 0) {
      flashListRef.current.scrollToEnd({ animated: true });
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
      <SecondaryHeader
        data={{
          id: Array.isArray(id) ? id[0] : id,
          name: Array.isArray(name) ? name[0] : name,
          image: Array.isArray(image) ? image[0] : image,
          bio: Array.isArray(bio) ? bio[0] : bio
        }}
        back={true}
        backPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("home");
          }
        }}
        menu={true}
        menuItems={menuItems}
        imageVersion={imageVersion}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <View
          style={[
            { flex: 1 },
            colorScheme === "dark"
              ? styleSheat.darkContentView
              : styleSheat.lightContentView,
            wallpaperColor && { backgroundColor: wallpaperColor }
          ]}
        >
          {isLoaded ? (
            <FlashList
              ref={flashListRef}
              data={chats}
              renderItem={({ item }) => {
                return (
                  <Message
                    data={{
                      id: item.id,
                      fromUser: item.fromUser,
                      toUser: item.toUser,
                      img: item.img,
                      msg: item.msg,
                      side: item.side,
                      status: item.status,
                      time: item.time,
                      replyMsg: item.replyMsg,
                      replyUser: item.replyUser,
                      replyImg: item.replyImg,
                      replyTime: item.replyTime,
                    }}
                    setReply={setReply}
                    setReplyData={setReplyData}
                  />
                );
              }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              estimatedItemSize={50}
              refreshing={refreshing}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styleSheat.mainView}
              keyExtractor={(item) => item.id}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              onContentSizeChange={goToBottom}
              ListEmptyComponent={
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
                </View>
              }
            />
          ) : (
            <View style={styleSheat.loadView}>
              <ActivityIndicator size={"large"} color={"#0C4EAC"} />
            </View>
          )}

          {showScrollToBottom && (
            <TouchableOpacity
              style={[
                styleSheat.scrollToBottomButton,
                colorScheme === 'dark' ? styleSheat.darkScrollButton : styleSheat.lightScrollButton
              ]}
              onPress={goToBottom}
              activeOpacity={0.8}
            >
              <Ionicons
                name="chevron-down"
                size={24}
                color={colorScheme === 'dark' ? "#fff" : "#0C4EAC"}
              />
            </TouchableOpacity>
          )}
          <View
            style={
              colorScheme === "dark" ? styleSheat.darkView : styleSheat.lightView
            }
          >
            {reply !== 0 && (
              <View
                style={[
                  styleSheat.replyView,
                  colorScheme === "dark"
                    ? styleSheat.darkBorder
                    : styleSheat.lightBorder,
                ]}
              >
                <View style={styleSheat.replyInnerView}>
                  <View style={{ flexDirection: "row", columnGap: 8 }}>
                    <Ionicons
                      name="arrow-undo"
                      size={14}
                      style={
                        colorScheme === "dark"
                          ? styleSheat.darkText
                          : styleSheat.lightText
                      }
                    />
                    <Text
                      style={
                        colorScheme === "dark"
                          ? styleSheat.darkText
                          : styleSheat.lightText
                      }
                    >
                      Reply
                    </Text>
                  </View>
                  <TouchableHighlight
                    underlayColor={colorScheme === "dark" ? "#404040" : "#F1F1F1"}
                    activeOpacity={0.7}
                    onPress={() => {
                      setReply(0);
                    }}
                    style={styleSheat.closeButton}
                  >
                    <Image
                      source={icons.close}
                      style={{
                        tintColor: colorScheme === "dark" ? "#fff" : "#0C4EAC",
                        width: 10,
                        height: 10,
                      }}
                      contentFit="contain"
                    />
                  </TouchableHighlight>
                </View>
                <Text
                  style={
                    colorScheme === "dark"
                      ? styleSheat.darkText
                      : styleSheat.lightText
                  }
                >
                  {replyData.user}
                </Text>
                <Text
                  style={
                    colorScheme === "dark"
                      ? styleSheat.darkText
                      : styleSheat.lightText
                  }
                >
                  {replyData.msg && `${replyData.msg.substring(0, 50)}...`}
                </Text>
              </View>
            )}
            {msgImage && (
              <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
                <View style={{ alignItems: "flex-end", flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={colorScheme === "dark" ? styleSheat.darkText : styleSheat.lightText}>
                    Image Selected
                  </Text>
                  <TouchableHighlight
                    underlayColor={colorScheme === "dark" ? "#404040" : "#F1F1F1"}
                    activeOpacity={0.7}
                    onPress={() => {
                      setMsgImage(null);
                    }}
                    style={styleSheat.closeButton}
                  >
                    <Image
                      source={icons.close}
                      style={{
                        tintColor: colorScheme === "dark" ? "#fff" : "#0C4EAC",
                        width: 10,
                        height: 10,
                      }}
                      contentFit="contain"
                    />
                  </TouchableHighlight>
                </View>
                <Image
                  source={{ uri: msgImage }}
                  style={{ width: "100%", height: 200, marginTop: 8, borderRadius: 8 }}
                  contentFit="contain"
                  cachePolicy="none"
                />

              </View>
            )}
            <View style={styleSheat.messageInputView}>
              <View
                style={[
                  colorScheme === "dark"
                    ? styleSheat.darkBorder
                    : styleSheat.lightBorder,
                  styleSheat.inputView,
                  focusedInput && styleSheat.focusedInput,
                ]}
              >
                <TextInput
                  style={[
                    colorScheme === "dark"
                      ? styleSheat.darkText
                      : styleSheat.lightText,
                    styleSheat.input,
                  ]}
                  placeholder="Message"
                  placeholderTextColor="#7b7b8b"
                  underlineColorAndroid="transparent"
                  onFocus={() => setFocusedInput(true)}
                  onBlur={() => setFocusedInput(false)}
                  value={message}
                  onChangeText={setMessage}
                />
                <TouchableHighlight
                  style={styleSheat.imageButton}
                  onPress={pickImageFromGallery}
                  activeOpacity={0.7}
                  underlayColor={colorScheme === "dark" ? "#404040" : "#F1F1F1"}
                >
                  <Image
                    source={icons.clip}
                    style={[
                      styleSheat.clipIcon,
                      { tintColor: colorScheme === "dark" ? "#fff" : "#0C4EAC" },
                    ]}
                    contentFit="contain"
                  />
                </TouchableHighlight>
              </View>
              <TouchableOpacity
                style={styleSheat.messageButton}
                activeOpacity={0.7}
                onPress={sendMessage}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Progress.Circle
                    progress={uploadProgress}
                    size={30}
                    color="#fff"
                    unfilledColor="rgba(255, 255, 255, 0.2)"
                    borderWidth={0}
                    thickness={3}
                  />
                ) : (
                  <Image
                    source={icons.send}
                    style={styleSheat.sendIcon}
                    contentFit="contain"
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;

const styleSheat = StyleSheet.create({
  darkMainView: {
    flex: 1,
    backgroundColor: "#000000",
  },
  lightMainView: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  darkContentView: {
    flex: 1,
    backgroundColor: "#111827",
  },
  lightContentView: {
    flex: 1,
    backgroundColor: "#e2e8f0",
  },
  mainView: {
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  darkView: {
    backgroundColor: "#000",
  },
  lightView: {
    backgroundColor: "#fff",
  },
  darkText: {
    color: "#cbd5e1",
  },
  lightText: {
    color: "#374151",
  },
  replyView: {
    marginHorizontal: 12,
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderRadius: 12,
  },
  replyInnerView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeButton: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
  },
  messageInputView: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  inputView: {
    flex: 1,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 2,
  },
  input: {
    flex: 1,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 15,
  },
  focusedInput: {
    borderColor: "#0C4EAC",
  },
  darkBorder: {
    borderColor: "#d1d5db",
  },
  lightBorder: {
    borderColor: "#6b7280",
  },
  imageButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    padding: 12,
    transform: [{ scaleY: -1 }],
  },
  clipIcon: {
    width: 20,
    height: 20,
  },
  messageButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0c4eac",
    borderRadius: 9999,
    width: 50,
    height: 50,
  },
  sendIcon: {
    tintColor: "#fff",
    width: 20,
    height: 20,
  },
  loadView: {
    flex: 1,
    padding: 12,
  },
  scrollToBottomButton: {
    position: "absolute",
    bottom: 90,
    right: 10,
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    zIndex: 10,
    opacity: 0.8,
  },
  darkScrollButton: {
    backgroundColor: "#1f2937",
    borderColor: "#374151",
    borderWidth: 1,
  },
  lightScrollButton: {
    backgroundColor: "#fff",
    borderColor: "#e5e7eb",
    borderWidth: 1,
  },
});
