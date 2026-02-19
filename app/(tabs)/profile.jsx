import {
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAppAlert } from "@/components/AlertProvider";
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
import { containsNumbers } from "@/hooks/validation";

const menuItems = [
  {
    title: "New Chat",
    handlePress: () => {
      router.push({
        pathname: "new-chat",
        params: { back: "profile" },
      });
    },
  },
  {
    title: "Help",
    handlePress: () => {
      router.push({
        pathname: "help",
        params: { back: "profile" },
      });
    },
  },
  {
    title: "Sign Out",
    handlePress: async () => {
      await AsyncStorage.removeItem("user");
      router.replace("/");
    },
  },
];

const profile = () => {
  const colorScheme = useColorScheme();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { showAlert } = useAppAlert();

  const [bottomSheetVisibility, setBottomSheetVisibility] = useState(false);
  const [title, setTitle] = useState();
  const [value, setValue] = useState();
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [visibility, setVisibility] = useState(false);
  const [imageVersion, setImageVersion] = useState(Date.now());

  const getUser = async () => {
    const storedData = await AsyncStorage.getItem("user");
    if (storedData) {
      let user = JSON.parse(storedData);
      console.log("Loaded User Profile:", JSON.stringify(user));

      // Check if the stored data is an error response instead of valid user data
      if (user.ok === false) {
        console.log("Invalid user data detected, clearing and redirecting to sign-in");
        await AsyncStorage.removeItem("user");
        router.replace("/(auth)/sign-in");
        return;
      }

      // Extract the user object if it's nested (for backward compatibility)
      if (user.ok === true && user.user) {
        console.log("Extracting nested user data");
        user = user.user;
        // Re-save the corrected data
        await AsyncStorage.setItem("user", JSON.stringify(user));
      }

      setUser(user);
    }
  };

  const update = async () => {
    if (title === "Username" && value.length === 0) {
      showAlert("Warning", "Please enter your username!", "warning");
    } else if (title === "Username" && value.length < 3) {
      showAlert("Warning", "Your username must have more than 3 characters!", "warning");
    } else if (title === "Username" && value.length > 20) {
      showAlert(
        "Warning",
        "Your username has exceeded the maximum character limit!",
        "warning"
      );
    } else if (title === "First Name" && value.length === 0) {
      showAlert("Warning", "Please enter your first name!", "warning");
    } else if (title === "First Name" && value.length < 3) {
      showAlert(
        "Warning",
        "Your first name must have more than 3 characters!",
        "warning"
      );
    } else if (title === "First Name" && value.length > 50) {
      showAlert(
        "Warning",
        "Your first name has exceeded the maximum character limit!",
        "warning"
      );
    } else if (title === "First Name" && containsNumbers(value)) {
      showAlert("Warning", "Your first name can not has numbers!", "warning");
    } else if (title === "Last Name" && value.length === 0) {
      showAlert("Warning", "Please enter your last name!", "warning");
    } else if (title === "Last Name" && value.length < 3) {
      showAlert(
        "Warning",
        "Your last name must have more than 3 characters!",
        "warning"
      );
    } else if (title === "Last Name" && value.length > 50) {
      showAlert(
        "Warning",
        "Your last name has exceeded the maximum character limit!",
        "warning"
      );
    } else if (title === "Last Name" && containsNumbers(value)) {
      showAlert("Warning", "Your last name can not has numbers!", "warning");
    } else if (title === "Bio" && value.length === 0) {
    } else {

      try {
        let endpoint = "";
        let body = {};

        if (title === "Username") {
          endpoint = "/update-username";
          body = {
            id: user._id || user.id,
            username: value,
          };
        } else {
          endpoint = "/update";
          body = {
            user: user._id || user.id,
            f_name: title === "First Name" ? value : user.f_name,
            l_name: title === "Last Name" ? value : user.l_name,
            bio: title === "Bio" ? value : user.bio,
          };
        }

        const response = await fetch(`${apiUrl}${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.ok) {
            const updatedUser = { ...user };
            if (title === "Username") updatedUser.username = value;
            if (title === "First Name") updatedUser.f_name = value;
            if (title === "Last Name") updatedUser.l_name = value;
            if (title === "Bio") updatedUser.bio = value;

            if (title === "Username") {
              const storedData = await AsyncStorage.getItem("remember-me");
              if (storedData !== null) {
                const userData = JSON.parse(storedData);
                const rememberMe = {
                  username: updatedUser.username,
                  password: userData.password,
                };
                await AsyncStorage.setItem(
                  "remember-me",
                  JSON.stringify(rememberMe)
                );
              }
            }

            showAlert("Success", "Profile successfully updated!", "success");

            setBottomSheetVisibility(false);
            setTitle("");
            setValue("");
            setUser(updatedUser);
            await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
          } else {
            showAlert("Error", result.msg || "Update failed", "error");
          }
        } else {
          const errorText = await response.text();
          try {
            const errorJson = JSON.parse(errorText);
            showAlert("Error", errorJson.msg || "Update failed", "error");
          } catch (e) {
            showAlert("Error", "Update failed", "error");
          }
        }
      } catch (error) {
        console.log(error);
        showAlert("Error", "Network error", "error");
      }
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
        setBottomSheetVisibility(true);
        setTitle("Username");
        setValue(user && user.username);
      },
    },
    {
      title: "First Name",
      editable: true,
      value: user && user.f_name,
      handlePress: () => {
        setBottomSheetVisibility(true);
        setTitle("First Name");
        setValue(user && user.f_name);
      },
    },
    {
      title: "Last Name",
      editable: true,
      value: user && user.l_name,
      handlePress: () => {
        setBottomSheetVisibility(true);
        setTitle("Last Name");
        setValue(user && user.l_name);
      },
    },
    {
      title: "Bio",
      editable: true,
      value: user && user.bio,
      handlePress: () => {
        setBottomSheetVisibility(true);
        setTitle("Bio");
        setValue(user && user.bio);
      },
    },
  ];

  const contactDetails = [
    {
      title: "Mobile Number",
      editable: false,
      value: user && user.mobile,
    },
    {
      title: "Email",
      editable: false,
      value: user && user.email,
    },
  ];

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={
        colorScheme === "dark"
          ? styleSheat.darkMainView
          : styleSheat.lightMainView
      }
    >
      <PrimaryHeader title="User Profile" menu={false} menuItems={menuItems} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          style={[
            { flex: 1 },
            colorScheme === "dark"
              ? styleSheat.darkContentView
              : styleSheat.lightContentView,
          ]}
        >
          {user && (
            <ScrollView
              contentContainerStyle={{ paddingBottom: 20 }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styleSheat.imageView}>
                <PrimaryImagePicker
                  image={image}
                  title={"Edit Profile Picture"}
                  user={user}
                  setTitle={setTitle}
                  setValue={setValue}
                  setBottomSheetVisibility={setBottomSheetVisibility}
                  imageVersion={imageVersion}
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
                  </View>
                ))}
                <BottomSheet
                  visibility={bottomSheetVisibility}
                  setVisibility={setBottomSheetVisibility}
                  image={image}
                  setImage={setImage}
                  title={title}
                  value={value}
                  autoSave={true}
                  setValue={setValue}
                  onSuccess={() => {
                    setImageVersion(Date.now());
                    setImage(null);
                    getUser();
                  }}
                  handlePress={
                    (title === "Username" ||
                      title === "First Name" ||
                      title === "Last Name" ||
                      title === "Bio") &&
                    update
                  }
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
                    Contact Details
                  </Text>
                </View>
                {contactDetails.map((item, index) => (
                  <DetialInput
                    title={item.title}
                    value={item.value}
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
                    <View style={styleSheat.questionInnerView}>
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
                    </View>
                  </TouchableHighlight>
                  {visibility && <UpdatePassword user={user} />}
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default profile;

const styleSheat = StyleSheet.create({
  darkMainView: {
    flex: 1,
    backgroundColor: "#000000",
  },
  lightMainView: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  darkContentView: {
    backgroundColor: "#111827",
  },
  lightContentView: {
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
    padding: 8,
    borderRadius: 12,
  },
  questionInnerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
