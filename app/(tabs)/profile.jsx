import {
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  StyleSheet,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DetialInput from "@/components/DetialInput";
import PrimaryHeader from "@/components/PrimaryHeader";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";
import BottomSheet from "@/components/BottomSheat";
import PrimaryImagePicker from "@/components/PrimaryImagePicker";
import { Image } from "expo-image";
import icons from "@/constants/icons";
import UpdatePassword from "@/components/UpdatePassword";

const MenuItems = [
  {
    title: "New Chat",
    handlePress: () => {
      router.replace({
        pathname: "/new-chat",
        params: { back: "/profile" },
      });
    },
  },
  {
    title: "Help",
    handlePress: () => {
      router.replace({
        pathname: "/help",
        params: { back: "/profile" },
      });
    },
  },
  {
    title: "Sign Out",
    handlePress: async () => {
      AsyncStorage.removeItem("user");
      router.replace("sign-in");
    },
  },
];

const profile = () => {
  const colorScheme = useColorScheme();

  const [bottomSheetVisibility, setBottomSheetVisibility] = useState(false);
  const [title, setTitle] = useState();
  const [value, setValue] = useState();
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [visibility, setVisibility] = useState(false);

  const getUser = async () => {
    const storedData = await AsyncStorage.getItem("user");
    if (storedData) {
      const user = JSON.parse(storedData);
      setUser(user);
    } else {
      router.replace("sign-in");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const personalDetials = [
    {
      title: "Username",
      editable: true,
      value: user && user.username,
      handlePress: () => {
        setTitle("Username");
        setValue(user && user.username);
        setBottomSheetVisibility(true);
      },
    },
    {
      title: "First Name",
      editable: true,
      value: user && user.f_name,
      handlePress: () => {
        setTitle("First Name");
        setValue(user && user.f_name);
        setBottomSheetVisibility(true);
      },
    },
    {
      title: "Last Name",
      editable: true,
      value: user && user.l_name,
      handlePress: () => {
        setTitle("Last Name");
        setValue(user && user.l_name);
        setBottomSheetVisibility(true);
      },
    },
    {
      title: "Bio",
      editable: true,
      value: user && user.bio,
      handlePress: () => {
        setTitle("Bio");
        setValue(user && user.bio);
        setBottomSheetVisibility(true);
      },
    },
  ];

  const contactDetails = [
    {
      title: "Mobile Number",
      editable: true,
      value: user && user.mobile,
      handlePress: () => {
        setTitle("Mobile Number");
        setValue(user && user.mobile);
        setBottomSheetVisibility(true);
      },
    },
    {
      title: "Email",
      editable: true,
      value: user && user.email,
      handlePress: () => {
        setTitle("Email");
        setValue(user && user.email);
        setBottomSheetVisibility(true);
      },
    },
  ];

  return (
    <SafeAreaView
      style={
        colorScheme === "dark"
          ? styleSheat.darkMainView
          : styleSheat.lightMainView
      }
    >
      <PrimaryHeader title="User Profile" menu={true} menuItems={MenuItems} />
      {user && (
        <ScrollView>
          <View style={styleSheat.imageView}>
            <PrimaryImagePicker
              image={image}
              title={"Edit Profile Picture"}
              user={user}
              setTitle={setTitle}
              setValue={setValue}
              setBottomSheetVisibility={setBottomSheetVisibility}
            />
          </View>
          <View
            style={[
              styleSheat.view,
              colorScheme === "dark"
                ? styleSheat.darkView
                : styleSheat.lightView,
            ]}
          >
            <View style={styleSheat.titleView}>
              <Text
                style={[
                  styleSheat.title,
                  colorScheme === "dark"
                    ? styleSheat.darkText
                    : styleSheat.lightText,
                ]}
              >
                Personal Details
              </Text>
            </View>
            {personalDetials.map((item, index) => (
              <View key={index}>
                <DetialInput
                  title={item.title}
                  value={item.value}
                  editable={item.editable}
                  handlePress={item.handlePress}
                />
                <BottomSheet
                  visibility={bottomSheetVisibility}
                  setVisibility={setBottomSheetVisibility}
                  image={image}
                  setImage={setImage}
                  title={title}
                  value={value}
                  autoSave={true}
                />
              </View>
            ))}
          </View>
          <View
            style={[
              styleSheat.view,
              colorScheme === "dark"
                ? styleSheat.darkView
                : styleSheat.lightView,
            ]}
          >
            <View style={styleSheat.titleView}>
              <Text
                style={[
                  styleSheat.title,
                  colorScheme === "dark"
                    ? styleSheat.darkText
                    : styleSheat.lightText,
                ]}
              >
                Contact Details
              </Text>
            </View>
            {contactDetails.map((item, index) => (
              <DetialInput
                title={item.title}
                value={item.value}
                editable={item.editable}
                handlePress={item.handlePress}
                key={index}
              />
            ))}
          </View>
          <View
            style={[
              styleSheat.view,
              colorScheme === "dark"
                ? styleSheat.darkView
                : styleSheat.lightView,
              { marginBottom: 32 },
            ]}
          >
            <View style={styleSheat.titleView}>
              <Text
                style={[
                  styleSheat.title,
                  colorScheme === "dark"
                    ? styleSheat.darkText
                    : styleSheat.lightText,
                ]}
              >
                Security Details
              </Text>
            </View>
            <View style={styleSheat.passwordButtonView}>
              <TouchableHighlight
                activeOpacity={0.8}
                style={styleSheat.questionButton}
                underlayColor={colorScheme === "dark" ? "#404040" : "#F1F1F1"}
                onPress={() => {
                  if (visibility === true) {
                    setVisibility(false);
                  } else {
                    setVisibility(true);
                  }
                }}
              >
                <>
                  <Text
                    style={[
                      styleSheat.question,
                      colorScheme === "dark"
                        ? styleSheat.darkText
                        : styleSheat.lightText,
                    ]}
                  >
                    Change Password
                  </Text>
                  <Image
                    source={visibility === true ? icons.minus : icons.plus}
                    style={[
                      styleSheat.icon,
                      { tintColor: colorScheme === "dark" && "#fff" },
                    ]}
                  />
                </>
              </TouchableHighlight>
              {visibility && <UpdatePassword />}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default profile;

const styleSheat = StyleSheet.create({
  darkMainView: {
    flex: 1,
    backgroundColor: "#111827",
  },
  lightMainView: {
    flex: 1,
    backgroundColor: "#e2e8f0",
  },
  imageView: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  view: {
    marginTop: 24,
    marginBottom: 12,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 12,
  },
  darkView: {
    backgroundColor: "#000",
  },
  lightView: {
    backgroundColor: "#fff",
  },
  titleView: {
    alignItems: "flex-start",
    width: 192,
    marginTop: 8,
    marginBottom: 12,
    marginHorizontal: 8,
  },
  title: {
    width: "100%",
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600",
    borderBottomWidth: 2,
    borderColor: "#0c4eac",
  },
  darkText: {
    color: "#f1f5f9",
  },
  lightText: {
    color: "#111827",
  },
  passwordButtonView: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 12,
  },
  questionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    borderRadius: 12,
  },
  question: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "600",
  },
  icon: {
    width: 20,
    height: 20,
  },
});
