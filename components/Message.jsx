import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";

const Message = ({ side, status, setReply }) => {
  const colorScheme = useColorScheme();

  return (
    <View
      style={[
        styleSheat.mainView,
        side === "right" && styleSheat.rightView,
        side === "left" && styleSheat.leftView,
      ]}
    >
      <TouchableHighlight
        style={styleSheat.replyButton}
        underlayColor={colorScheme === "dark" ? "#404040" : "#F1F1F1"}
        activeOpacity={0.7}
        onPress={() => {
          setReply(1);
        }}
      >
        <Ionicons name="arrow-undo" size={18} />
      </TouchableHighlight>
      <View
        style={[
          styleSheat.messageView,
          colorScheme === "dark" ? styleSheat.darkView : styleSheat.lightView,
        ]}
      >
        <Text
          style={[
            styleSheat.message,
            colorScheme === "dark" ? styleSheat.darkText : styleSheat.lightText,
          ]}
        >
          Message
        </Text>
        <View style={[styleSheat.timeView]}>
          {side === "left" && <Text></Text>}
          <Text
            style={[
              styleSheat.time,
              colorScheme === "dark"
                ? styleSheat.darkText
                : styleSheat.lightText,
            ]}
          >
            Time
          </Text>
          {side === "right" && (
            <>
              <Ionicons
                name={`${
                  status === 1 ? "checkmark-done-outline" : "checkmark-outline"
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
    maxWidth: "80%",
    minWidth: "30%",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
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
