import { Image } from "expo-image";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import icons from "@/constants/icons";
import { useColorScheme } from "@/hooks/useColorScheme";

const SecondaryHeader = ({ data, menu, menuItems, back, backPress }) => {
  const colorScheme = useColorScheme();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const [popupMenuVisible, setPopupMenuVisible] = useState(false);

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  const OpenPopupMenuModal = () => {
    setPopupMenuVisible(true);
  };
  const ClosePopupMenuModal = () => {
    setPopupMenuVisible(false);
  };

  const ModalItem = ({ title, handlePress }) => {
    return (
      <TouchableHighlight
        style={{ padding: 12 }}
        activeOpacity={0.8}
        underlayColor={colorScheme === "dark" ? "#404040" : "#F1F1F1"}
        onPress={handlePress}
      >
        <Text
          style={[
            styleSheat.menuItemText,
            colorScheme === "dark" ? styleSheat.darkText : styleSheat.lightText,
          ]}
        >
          {title}
        </Text>
      </TouchableHighlight>
    );
  };

  return (
    <View
      style={[
        styleSheat.view,
        colorScheme === "dark" ? styleSheat.darkView : styleSheat.lightView,
      ]}
      onTouchEnd={() => {
        popupMenuVisible && ClosePopupMenuModal();
      }}
    >
      {back && (
        <TouchableHighlight
          activeOpacity={0.7}
          style={styleSheat.backButton}
          underlayColor={colorScheme === "dark" ? "#404040" : "#F1F1F1"}
          onPress={backPress}
        >
          <Image
            source={icons.back}
            contentFit="contain"
            style={[
              styleSheat.icon,
              { tintColor: colorScheme === "dark" && "#fff" },
            ]}
          />
        </TouchableHighlight>
      )}
      <TouchableHighlight
        style={styleSheat.userDetails}
        activeOpacity={0.7}
        underlayColor={colorScheme === "dark" ? "#404040" : "#F1F1F1"}
        onPress={() => {}}
      >
        <>
          <Image
            source={{
              uri: `${apiUrl}/O3-Chat/${
                data.image
              }?timestamp=${new Date().getTime()}`,
            }}
            cachePolicy="reload"
            placeholder={{ blurhash }}
            style={[
              styleSheat.profileImage,
              colorScheme === "dark"
                ? { borderColor: "#4b5563" }
                : { borderColor: "#d1d5db" },
            ]}
            contentFit="contain"
          />
          <Text
            style={[
              colorScheme === "dark"
                ? styleSheat.darkText
                : styleSheat.lightText,
              styleSheat.usersName,
            ]}
          >
            {data.name}
          </Text>
        </>
      </TouchableHighlight>
      {menu && (
        <>
          <TouchableHighlight
            style={styleSheat.menuButton}
            activeOpacity={0.7}
            underlayColor={colorScheme === "dark" ? "#404040" : "#F1F1F1"}
            onPress={OpenPopupMenuModal}
          >
            <Image
              source={icons.menu}
              contentFit="contain"
              style={[
                styleSheat.icon,
                { tintColor: colorScheme === "dark" && "#fff" },
              ]}
            />
          </TouchableHighlight>
          <Modal
            animationType="fade"
            transparent={true}
            visible={popupMenuVisible}
            onRequestClose={ClosePopupMenuModal}
          >
            <TouchableWithoutFeedback onPress={ClosePopupMenuModal}>
              <View style={styleSheat.menu}>
                <View
                  style={[
                    styleSheat.menuView,
                    colorScheme === "dark"
                      ? styleSheat.darkView
                      : styleSheat.lightView,
                  ]}
                >
                  {menuItems.map((item, index) => (
                    <ModalItem
                      title={item.title}
                      key={index}
                      handlePress={item.handlePress}
                    />
                  ))}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </>
      )}
    </View>
  );
};

export default SecondaryHeader;

const styleSheat = StyleSheet.create({
  darkView: {
    backgroundColor: "#000",
    borderColor: "#0f172a",
  },
  lightView: {
    backgroundColor: "#fff",
    borderColor: "#e2e8f0",
  },
  darkText: {
    color: "#f1f5f9",
  },
  lightText: {
    color: "#111827",
  },
  view: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space",
    paddingHorizontal: 12,
    borderBottomWidth: 2,
  },
  backButton: {
    padding: 12,
    borderRadius: 9999,
    marginVertical: 12,
  },
  icon: {
    width: 20,
    height: 20,
  },
  userDetails: {
    flex: 1,
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    columnGap: 12,
  },
  usersName: {
    fontSize: 20,
    fontWeight: "600",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  menuButton: {
    padding: 12,
    borderRadius: 9999,
    marginVertical: 12,
  },
  menu: {
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingRight: 6,
    marginTop: 70,
  },
  menuView: {
    width: 208,
    borderRadius: 8,
    paddingVertical: 8,
    borderWidth: 2,
  },
  menuItemText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
});
