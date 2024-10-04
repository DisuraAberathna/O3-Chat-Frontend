import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TouchableHighlight } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

const MessageBox = ({ id }) => {
  const colorScheme = useColorScheme();

  return (
    <TouchableHighlight
      style={[
        styleSheat.view,
        colorScheme === "dark" ? styleSheat.darkView : styleSheat.lightView,
      ]}
      onPress={() => {
        router.replace({
          pathname: "/chat",
          params: { id: id },
        });
      }}
      underlayColor={colorScheme === "dark" ? "#404040" : "#F1F1F1"}
      activeOpacity={0.7}
    >
      <>
        <Image
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDJzEaxLN-jGRYYUO65pWu7Q9GXoNt4LUSSA&s",
          }}
          style={[
            styleSheat.profileImage,
            colorScheme === "dark"
              ? { borderColor: "#4b5563" }
              : { borderColor: "#d1d5db" },
          ]}
          contentFit="contain"
        />
        <View style={styleSheat.mainView}>
          <View style={styleSheat.nameMessageView}>
            <Text
              style={[
                styleSheat.name,
                colorScheme === "dark"
                  ? styleSheat.darkText
                  : styleSheat.lightText,
              ]}
            >
              User's Name
            </Text>
            <View style={styleSheat.messageView}>
              {/* <Ionicons name="checkmark-outline" color={"#fff"} size={14}/> */}
              <Ionicons name="checkmark-done-outline" color={"#15a9f9"} size={14}/>
              <Text
                style={[
                  styleSheat.message,
                  colorScheme === "dark"
                    ? styleSheat.darkText
                    : styleSheat.lightText,
                ]}
              >
                Hey.............................
              </Text>
            </View>
          </View>
          <View style={styleSheat.timeCountView}>
            <Text
              style={[
                styleSheat.time,
                colorScheme === "dark"
                  ? styleSheat.darkText
                  : styleSheat.lightText,
              ]}
            >
              2024/09/25
            </Text>
            <View style={styleSheat.countView}>
              <Text style={styleSheat.count}>99+</Text>
            </View>
          </View>
        </View>
      </>
    </TouchableHighlight>
  );
};

export default MessageBox;

const styleSheat = StyleSheet.create({
  view: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 6,
  },
  darkView: {
    backgroundColor: "#000",
  },
  lightView: {
    backgroundColor: "#fff",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  mainView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    height: "100%",
    marginLeft: 12,
  },
  nameMessageView: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 8,
    paddingTop: 4,
  },
  darkText: {
    color: "#f1f5f9",
  },
  lightText: {
    color: "#111827",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
  messageView: {
    flexDirection: "row",
    columnGap: 2,
  },
  message: {
    fontSize: 12,
    lineHeight: 16,
  },
  timeCountView: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: 8,
    paddingTop: 4,
  },
  time: {
    fontSize: 12,
    lineHeight: 18,
  },
  countView: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: "#0c4eac",
    alignItems: "center",
    borderRadius: 9999,
  },
  count: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 18,
  },
});
