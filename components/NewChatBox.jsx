import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TouchableHighlight } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { getImageUrl } from "../utils/common";

const NewChatBox = ({ data }) => {
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
          <View style={styleSheat.nameBioView}>
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
            <Text
              style={[
                styleSheat.bio,
                colorScheme === "dark"
                  ? styleSheat.darkText
                  : styleSheat.lightText,
              ]}
            >
              {data.bio}
            </Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default NewChatBox;

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
  nameBioView: {
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
  bio: {
    fontSize: 12,
    lineHeight: 16,
  },
});
