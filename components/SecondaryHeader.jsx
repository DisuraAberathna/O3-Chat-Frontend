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

const SecondaryHeader = ({ data, menu, menuItems, back, backPress, imageVersion }) => {
  const colorScheme = useColorScheme();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const [popupMenuVisible, setPopupMenuVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  const openPopupMenuModal = () => {
    setPopupMenuVisible(true);
  };

  const closePopupMenuModal = () => {
    setPopupMenuVisible(false);
  };

  const openUserModal = () => {
    setUserModalVisible(true);
  };

  const closeUserModal = () => {
    setUserModalVisible(false);
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
        popupMenuVisible && closePopupMenuModal();
        userModalVisible && closeUserModal();
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
        onPress={openUserModal}
      >
        <>
          <Image
            source={{
              uri: `${apiUrl}/o3_chat/${data.image}?v=${imageVersion || ""}`,
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
      <Modal
        animationType="fade"
        transparent={true}
        visible={userModalVisible}
        onRequestClose={closeUserModal}
      >
        <TouchableWithoutFeedback onPress={closeUserModal}>
          <View style={styleSheat.modal}>
            <View
              style={[
                styleSheat.modalView,
                colorScheme === "dark"
                  ? styleSheat.darkView
                  : styleSheat.lightView,
              ]}
            >
              <Image
                source={{
                  uri: `${apiUrl}/o3_chat/${data.image}?v=${imageVersion || ""}`,
                }}
                cachePolicy="none"
                placeholder={{ blurhash }}
                style={[
                  styleSheat.modalImage,
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
              <Text
                style={[
                  colorScheme === "dark"
                    ? styleSheat.darkText
                    : styleSheat.lightText,
                  styleSheat.usersName,
                ]}
              >
                {data.bio}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {menu && (
        <>
          <TouchableHighlight
            style={styleSheat.menuButton}
            activeOpacity={0.7}
            underlayColor={colorScheme === "dark" ? "#404040" : "#F1F1F1"}
            onPress={openPopupMenuModal}
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
            onRequestClose={closePopupMenuModal}
          >
            <TouchableWithoutFeedback onPress={closePopupMenuModal}>
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
    backgroundColor: "#000000",
    borderColor: "#0f172a",
  },
  lightView: {
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
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
  modal: {
    alignItems: "center",
    paddingRight: 6,
    marginTop: 70,
  },
  modalView: {
    width: "90%",
    borderRadius: 8,
    paddingVertical: 30,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    rowGap: 8,
  },
  modalImage: {
    width: 150,
    height: 150,
    borderWidth: 2,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
});
