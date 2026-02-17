import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TouchableHighlight } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { getImageUrl } from "../utils/common";

const MessageBox = ({ data }) => {
  const colorScheme = useColorScheme();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  return (
    <TouchableHighlight
      style={[
        styleSheat.view,
        colorScheme === "dark" ? styleSheat.darkView : styleSheat.lightView,
      ]}
      onPress={() => {
        router.replace({
          pathname: "/chat",
          params: {
            id: data.id,
            name: data.name,
            image: data.image,
            bio: data.bio,
          },
        });
      }}
      underlayColor={colorScheme === "dark" ? "#404040" : "#F1F1F1"}
      activeOpacity={0.7}
    >
      <View style={styleSheat.innerView}>
        <Image
          source={{
            uri: getImageUrl(data.image, apiUrl, data.imageVersion),
          }}
          cachePolicy="none"
          placeholder={{ blurhash }}
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
              {data.name}
            </Text>
            <View style={styleSheat.messageView}>
              {data.view && (
                <Ionicons
                  name={`${data.status === 1
                    ? "checkmark-outline"
                    : "checkmark-done-outline"
                    }`}
                  color={"#15a9f9"}
                  size={14}
                />
              )}
              <Text
                style={[
                  styleSheat.message,
                  colorScheme === "dark"
                    ? styleSheat.darkText
                    : styleSheat.lightText,
                ]}
              >
                {`${data.msg.substring(0, 40)}...`}
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
              {data.time}
            </Text>
            {data.count > 0 && (
              <View style={styleSheat.countView}>
                <Text style={styleSheat.count}>{data.count}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default MessageBox;

const styleSheat = StyleSheet.create({
  view: {
    borderRadius: 8,
    marginBottom: 6,
  },
  darkView: {
    backgroundColor: "#000000",
  },
  lightView: {
    backgroundColor: "#ffffff",
  },
  innerView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
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
