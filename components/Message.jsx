import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Image } from "expo-image";

const Message = ({ data, setReply, setReplyData }) => {
  const colorScheme = useColorScheme();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const blurhash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

  return (
    <View
      style={[
        styleSheat.mainView,
        data.side === "right" && styleSheat.rightView,
        data.side === "left" && styleSheat.leftView,
      ]}
    >
      <TouchableHighlight
        style={styleSheat.replyButton}
        underlayColor={colorScheme === "dark" ? "#404040" : "#F1F1F1"}
        activeOpacity={0.7}
        onPress={() => {
          setReply(data.id);
          setReplyData({
            msg: data.msg,
            user: data.fromUser,
          });
        }}
      >
        <Ionicons name="arrow-undo" size={18} />
      </TouchableHighlight>
      <View
        style={[
          styleSheat.messageView,
          colorScheme === "dark" ? styleSheat.darkView : styleSheat.lightView,
          data.img && { width: "90%" },
        ]}
      >
        {(data.replyMsg || data.replyImg) && (
          <View
            style={[
              {
                borderLeftWidth: 5,
                borderWidth: 1,
                paddingHorizontal: 8,
                paddingVertical: 4,
                marginBottom: 6,
                borderRadius: 8,
              },
              colorScheme === "dark"
                ? styleSheat.darkBorder
                : styleSheat.lightBorder,
            ]}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={[
                  colorScheme === "dark"
                    ? styleSheat.darkText
                    : styleSheat.lightText,
                ]}
              >
                {data.replyUser}
              </Text>
              <Text
                style={[
                  colorScheme === "dark"
                    ? styleSheat.darkText
                    : styleSheat.lightText,
                ]}
              >
                {data.replyTime}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                columnGap: 8,
              }}
            >
              {data.replyImg && (
                <Image
                  source={{
                    uri: `${apiUrl}/o3_chat/${data.replyImg}`,
                  }}
                  cachePolicy="none"
                  placeholder={{ blurhash }}
                  placeholderContentFit="fill"
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 8,
                    marginVertical: 4,
                  }}
                  contentFit="cover"
                />
              )}
              {data.replyMsg && (
                <Text
                  style={[
                    colorScheme === "dark"
                      ? styleSheat.darkText
                      : styleSheat.lightText,
                    { flex: 1 },
                  ]}
                >
                  {`${data.replyMsg.substring(0, 50)}...`}
                </Text>
              )}
            </View>
          </View>
        )}
        {data.img && (
          <Image
            source={{
              uri: `${apiUrl}/o3_chat/${data.img}`,
            }}
            cachePolicy="none"
            placeholder={{ blurhash }}
            placeholderContentFit="fill"
            style={{
              width: "100%",
              height: 400,
              borderRadius: 8,
              marginBottom: 4,
            }}
            contentFit="cover"
          />
        )}
        {data.msg && (
          <Text
            style={[
              styleSheat.message,
              colorScheme === "dark"
                ? styleSheat.darkText
                : styleSheat.lightText,
            ]}
          >
            {data.msg}
          </Text>
        )}
        <View style={[styleSheat.timeView]}>
          {data.side === "left" && <Text></Text>}
          <Text
            style={[
              styleSheat.time,
              colorScheme === "dark"
                ? styleSheat.darkText
                : styleSheat.lightText,
            ]}
          >
            {data.time}
          </Text>
          {data.side === "right" && (
            <>
              <Ionicons
                name={`${data.status === 1
                    ? "checkmark-outline"
                    : "checkmark-done-outline"
                  }`}
                color={"#15a9f9"}
                size={14}
              />
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default Message;

const styleSheat = StyleSheet.create({
  mainView: {
    width: "100%",
    paddingHorizontal: 12,
    marginTop: 8,
    alignItems: "center",
    columnGap: 12,
  },
  rightView: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  leftView: {
    flexDirection: "row-reverse",
    justifyContent: "flex-end",
  },
  replyButton: {
    width: 30,
    height: 30,
    backgroundColor: "#b7b7b7",
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  messageView: {
    width: "70%",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  darkBorder: {
    borderColor: "#d1d5db",
  },
  lightBorder: {
    borderColor: "#6b7280",
  },
  darkView: {
    backgroundColor: "#000",
  },
  lightView: {
    backgroundColor: "#fff",
  },
  message: {
    fontSize: 16,
    fontWeight: "500",
  },
  darkText: {
    color: "#f1f5f9",
  },
  lightText: {
    color: "#111827",
  },
  timeView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  time: {
    fontSize: 12,
  },
});
