import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import icons from "@/constants/icons";
import { Image } from "expo-image";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getImageUrl } from "../utils/common";

const PrimaryImagePicker = ({
  image,
  title,
  setTitle,
  setValue,
  bottomSheetVisibility,
  setBottomSheetVisibility,
  user,
  imageVersion,
}) => {
  const colorScheme = useColorScheme();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styleSheat.button,
        colorScheme === "dark" ? styleSheat.darkBorder : styleSheat.lightBorder,
        bottomSheetVisibility && styleSheat.focused,
      ]}
      onPress={() => {
        setTitle(title);
        setValue("");
        setBottomSheetVisibility(true);
      }}
    >
      {user !== null && user.profile_img !== null ? (
        <>
          <Image
            source={
              image === null
                ? {
                  uri: getImageUrl(user.profile_img, apiUrl, imageVersion),
                }
                : { uri: image }
            }
            placeholder={{ blurhash }}
            cachePolicy="none"
            style={[
              image === null
                ? { width: 144, height: 144 }
                : { width: 150, height: 150 },
              { borderRadius: 9999 },
            ]}
            contentFit="contain"
          />
        </>
      ) : (
        <Image
          source={image === null ? icons.addProfile : { uri: image }}
          style={[
            image === null
              ? {
                width: 80,
                height: 80,
                tintColor: colorScheme === "dark" ? "#fff" : "#0C4EAC",
              }
              : { width: 150, height: 150, borderRadius: 9999 },
          ]}
          contentFit="contain"
        />
      )}
    </TouchableOpacity>
  );
};

export default PrimaryImagePicker;

const styleSheat = StyleSheet.create({
  button: {
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    marginTop: 24,
    width: 160,
    height: 160,
  },
  darkBorder: {
    borderColor: "#d1d5db",
  },
  lightBorder: {
    borderColor: "#6b7280",
  },
  focused: {
    borderColor: "#0C4EAC",
  },
});
