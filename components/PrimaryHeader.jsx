import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  TouchableHighlight,
  StyleSheet,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import icons from "@/constants/icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Image } from "expo-image";

const PrimaryHeader = ({
  title,
  menu,
  menuItems,
  back,
  backPress,
  searchFieldVisibility,
  searchText,
  setSearchText,
  closeOnPress,
  searchOnPress,
}) => {
  const colorScheme = useColorScheme();
  const [popupMenuVisible, setPopupMenuVisible] = useState(false);

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
    <>
      <View
        style={[
          styleSheat.view,
          colorScheme === "dark" ? styleSheat.darkView : styleSheat.lightView,
          searchFieldVisibility
            ? { borderBottomWidth: 0 }
            : { borderBottomWidth: 2 },
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
        <Text
          style={[
            title === "O3 Chat" ? styleSheat.snap : styleSheat.normal,
            colorScheme === "dark" ? styleSheat.darkText : styleSheat.lightText,
          ]}
        >
          {title}
        </Text>
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
      {searchFieldVisibility && (
        <View
          style={[
            styleSheat.searchView,
            colorScheme === "dark" ? styleSheat.darkView : styleSheat.lightView,
          ]}
          onTouchEnd={() => {
            popupMenuVisible && ClosePopupMenuModal();
          }}
        >
          <TouchableHighlight
            activeOpacity={0.7}
            style={styleSheat.closeButton}
            underlayColor={colorScheme === "dark" ? "#404040" : "#F1F1F1"}
            onPress={closeOnPress}
          >
            <Image
              source={icons.collapse}
              contentFit="contain"
              style={[
                styleSheat.closeIcon,
                { tintColor: colorScheme === "dark" && "#fff" },
              ]}
            />
          </TouchableHighlight>
          <TextInput
            placeholder="Search Users..."
            placeholderTextColor="#7b7b8b"
            style={[
              styleSheat.searchFeild,
              colorScheme === "dark"
                ? styleSheat.darkText
                : styleSheat.lightText,
            ]}
            inputMode="search"
            autoCorrect={false}
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableHighlight
            activeOpacity={0.7}
            style={styleSheat.closeButton}
            underlayColor={colorScheme === "dark" ? "#404040" : "#F1F1F1"}
            onPress={searchOnPress}
          >
            <Image
              source={icons.search}
              contentFit="contain"
              style={[
                styleSheat.searchIcon,
                { tintColor: colorScheme === "dark" && "#fff" },
              ]}
            />
          </TouchableHighlight>
        </View>
      )}
    </>
  );
};

export default PrimaryHeader;

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
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  backButton: {
    padding: 12,
    borderRadius: 9999,
  },
  icon: {
    width: 20,
    height: 20,
  },
  snap: {
    fontFamily: "snap-itc",
    fontSize: 30,
    lineHeight: 36,
  },
  normal: {
    fontWeight: "700",
    fontSize: 24,
    lineHeight: 32,
  },
  menuButton: {
    padding: 12,
    borderRadius: 9999,
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
  searchView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderBottomWidth: 2,
    columnGap: 8,
  },
  closeButton: {
    padding: 8,
    borderRadius: 9999,
  },
  closeIcon: {
    width: 18,
    height: 18,
  },
  searchFeild: {
    flex: 1,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 1.5,
    borderBottomWidth: 1,
    borderColor: "#6b7280",
  },
  searchIcon: {
    width: 18,
    height: 18,
  },
});
