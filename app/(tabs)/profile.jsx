import {
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  StyleSheet,
  Alert,
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
      router.replace("sign-in");
    },
  },
];

const profile = () => {
  const colorScheme = useColorScheme();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

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

  const update = async () => {
    if (title === "Username" && value.length === 0) {
      Alert.alert("Warning", "Please enter your username!");
    } else if (title === "Username" && value.length < 3) {
      Alert.alert("Warning", "Your username must have more than 3 characters!");
    } else if (title === "Username" && value.length > 20) {
      Alert.alert(
        "Warning",
        "Your username has exceeded the maximum character limit!"
      );
    } else if (title === "First Name" && value.length === 0) {
      Alert.alert("Warning", "Please enter your first name!");
    } else if (title === "First Name" && value.length < 3) {
      Alert.alert(
        "Warning",
        "Your first name must have more than 3 characters!"
      );
    } else if (title === "First Name" && value.length > 50) {
      Alert.alert(
        "Warning",
        "Your first name has exceeded the maximum character limit!"
      );
    } else if (title === "First Name" && containsNumbers(value)) {
      Alert.alert("Warning", "Your first name can not has numbers!");
    } else if (title === "Last Name" && value.length === 0) {
      Alert.alert("Warning", "Please enter your last name!");
    } else if (title === "Last Name" && value.length < 3) {
      Alert.alert(
        "Warning",
        "Your last name must have more than 3 characters!"
      );
    } else if (title === "Last Name" && value.length > 50) {
      Alert.alert(
        "Warning",
        "Your last name has exceeded the maximum character limit!"
      );
    } else if (title === "Last Name" && containsNumbers(value)) {
      Alert.alert("Warning", "Your last name can not has numbers!");
    } else if (title === "Bio" && value.length === 0) {
    } else {
      const reqObject = {
        user: user.id,
        username: title === "Username" ? value : user.username,
        f_name: title === "First Name" ? value : user.f_name,
        l_name: title === "Last Name" ? value : user.l_name,
        bio: title === "Bio" ? value : user.bio,
      };

      try {
        const response = await fetch(`${apiUrl}/O3-Chat/Update`, {
          method: "POST",
          body: JSON.stringify(reqObject),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();

          if (data.ok) {
            AsyncStorage.setItem("user", JSON.stringify(data.user));

            if (title === "Username") {
              const storedData = await AsyncStorage.getItem("remember-me");
              if (storedData !== null) {
                const rememberMe = {
                  username: data.user.username,
                  password: data.user.password,
                };
                await AsyncStorage.setItem(
                  "remember-me",
                  JSON.stringify(rememberMe)
                );
              }
            }

            Alert.alert("Information", "Your profile successfully updated!");

            setBottomSheetVisibility(false);
            setTitle("");
            setValue("");
            getUser();
          } else {
            Alert.alert("Warning", data.msg);
          }
        } else {
          Alert.alert(
            "Error",
            "Profile update failed \nCan not process this request!"
          );
        }
      } catch (error) {
        console.log(error);
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
      style={
        colorScheme === "dark"
          ? styleSheat.darkMainView
          : styleSheat.lightMainView
      }
    >
      <PrimaryHeader title="User Profile" menu={true} menuItems={menuItems} />
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
                  setValue={setValue}
                  handlePress={
                    (title === "Username" ||
                      title === "First Name" ||
                      title === "Last Name" ||
                      title === "Bio") &&
                    update
                  }
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
              {visibility && <UpdatePassword user={user} />}
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
