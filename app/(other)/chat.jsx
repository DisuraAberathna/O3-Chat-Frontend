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
      const storedData = await AsyncStorage.getItem("user");

      if (storedData) {
        const user = JSON.parse(storedData);
        setUser(user);

        const response = await fetch(`${apiUrl}/message/${user.id}/${id}`);
        if (response.ok) {
          const data = await response.json();
          setChats(data);
        }
        setIsLoaded(true);
        setLoad(false);
      } else {
        router.replace("sign-in");
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

  const sendMessage = async () => {
    if (user !== null) {
      if (msgImage || message.length !== 0) {
        let uploadedImageUrl = null;

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

        const reqObject = {
          senderId: user.id,
          receiverId: id,
          msg: message,
          image: uploadedImageUrl
        };

        try {
          const response = await fetch(`${apiUrl}/message/send`, {
            method: "POST",
            body: JSON.stringify(reqObject),
            headers: { "Content-Type": "application/json" }
          });

          if (response.ok) {
            setLoad(true);
            setMessage("");
            setMsgImage(null);
            setReply(0);
            setReplyData({});
            setFocusedInput(false);
          } else {
            showAlert("Error", "Failed to send message", "error");
          }
        } catch (error) {
          console.error(error);
          showAlert("Error", "Failed to send message", "error");
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
          router.replace("home");
        }}
        menu={true}
        menuItems={menuItems}
        imageVersion={imageVersion}
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
              {isUploading && (
                <View style={{ marginTop: 10, alignItems: 'center' }}>
                  <Progress.Bar
                    progress={uploadProgress}
                    width={null}
                    color={colorScheme === "dark" ? "#fff" : "#0C4EAC"}
                    borderWidth={0}
                    unfilledColor={colorScheme === "dark" ? "#404040" : "#e2e8f0"}
                    style={{ width: "100%" }}
                  />
                  <Text style={[{ marginTop: 5 }, colorScheme === "dark" ? styleSheat.darkText : styleSheat.lightText]}>
                    Uploading... {Math.round(uploadProgress * 100)}%
                  </Text>
                </View>
              )}
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
            >
              <Image
                source={icons.send}
                style={styleSheat.sendIcon}
                contentFit="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
});
