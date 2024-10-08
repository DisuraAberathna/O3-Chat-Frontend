import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import PrimaryInput from "@/components/PrimaryInput";
import PrimaryButton from "@/components/PrimaryButton";
import images from "@/constants/images";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PrimaryImagePicker from "@/components/PrimaryImagePicker";
import { Image } from "expo-image";
import BottomSheet from "@/components/BottomSheat";
import { Link, router } from "expo-router";
import { validateMobile, validateEmail } from "@/hooks/validation";
import { Ionicons } from "@expo/vector-icons";

const registerForm2 = () => {
  const colorScheme = useColorScheme();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const [image, setImage] = useState(null);
  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [bottomSheetVisibility, setBottomSheetVisibility] = useState(false);
  const [title, setTitle] = useState();
  const [value, setValue] = useState();

  const submit = async () => {
    if (image === null) {
      Alert.alert("Warning", "Please select a profile picture!");
    } else if (mobile.length === 0) {
      Alert.alert("Warning", "Please enter your mobile number!");
    } else if (!validateMobile(mobile)) {
      Alert.alert("Warning", "Please enter valid mobile number! \n07********");
    } else if (username.length === 0) {
      Alert.alert("Warning", "Please enter your username!");
    } else if (username.length < 3) {
      Alert.alert("Warning", "Your username must have more than 3 characters!");
    } else if (username.length > 20) {
      Alert.alert(
        "Warning",
        "Your username has exceeded the maximum character limit!"
      );
    } else if (email.length === 0) {
      Alert.alert("Warning", "Please enter your email!");
    } else if (!validateEmail(email)) {
      Alert.alert("Warning", "Please enter valid email!");
    } else if (email.length > 100) {
      Alert.alert(
        "Warning",
        "Your email has exceeded the maximum character limit!"
      );
    } else {
      setIsProcessing(true);
      try {
        const storedData = await AsyncStorage.getItem("new-user");

        if (storedData !== null) {
          const new_user = JSON.parse(storedData);

          const form = new FormData();
          form.append("f_name", new_user.firstName);
          form.append("l_name", new_user.lastName);
          form.append("password", new_user.password);
          form.append("image", {
            uri: image,
            type: "image/png",
            name: "avatar.png",
          });
          form.append("mobile", mobile);
          form.append("username", username);
          form.append("email", email);

          const response = await fetch(`${apiUrl}/O3-Chat/Register`, {
            method: "POST",
            body: form,
          });

          if (response.ok) {
            const data = await response.json();

            if (data.ok) {
              await AsyncStorage.removeItem("new-user");

              const user = {
                userId: data.user,
              };

              await AsyncStorage.setItem("not-verified-user", JSON.stringify(user));

              Alert.alert(
                "Information",
                "Verification code send to your email!",
                {
                  text: "OK",
                  onPress: () => {
                    router.replace({
                      pathname: "verify",
                      params: { timer: false },
                    });
                  },
                }
              );
            } else {
              Alert.alert("Warning", data.msg);
            }
          } else {
            Alert.alert(
              "Error",
              "Registration failed \nCan not process this request!"
            );
            setIsProcessing(false);
          }
        } else {
          router.push("register-form-1");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <SafeAreaView
      style={
        colorScheme === "dark" ? styleSheat.darkView : styleSheat.lightView
      }
    >
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View style={styleSheat.mainView}>
          <View style={styleSheat.linkView}>
            <Link href="/register-form-1" style={styleSheat.link}>
              <Ionicons name="chevron-back-outline" size={12} />
              Back
            </Link>
          </View>
          <View style={styleSheat.logoView}>
            <Image
              source={images.logo}
              style={styleSheat.logo}
              contentFit="contain"
            />
            <Text
              style={[
                styleSheat.snap,
                colorScheme === "dark"
                  ? styleSheat.darkText
                  : styleSheat.lightText,
                { fontSize: 36, lineHeight: 40 },
              ]}
            >
              O3 Chat
            </Text>
          </View>
          <View style={styleSheat.inputView}>
            <View className="w-full items-center">
              <PrimaryImagePicker
                image={image}
                title={"Profile Picture"}
                user={null}
                setTitle={setTitle}
                setValue={setValue}
                setBottomSheetVisibility={setBottomSheetVisibility}
                bottomSheetVisibility={bottomSheetVisibility}
              />
            </View>
            <PrimaryInput
              title="Mobile Number"
              titleStyles={styleSheat.inputTitle}
              otherStyles={styleSheat.input}
              keyboardType="number-pad"
              maxLength={10}
              handleChangeText={setMobile}
              value={mobile}
            />
            <PrimaryInput
              title="Username"
              titleStyles={styleSheat.inputTitle}
              otherStyles={styleSheat.input}
              handleChangeText={setUsername}
              value={username}
              maxLength={20}
            />
            <PrimaryInput
              title="Email"
              titleStyles={styleSheat.inputTitle}
              otherStyles={styleSheat.input}
              handleChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              maxLength={100}
            />
            <PrimaryButton
              title={isProcessing ? "Processing..." : "Register"}
              containerStyles={styleSheat.button}
              textStyles={styleSheat.buttonText}
              handlePress={submit}
              isLoading={isProcessing}
            />
          </View>
          <BottomSheet
            visibility={bottomSheetVisibility}
            setVisibility={setBottomSheetVisibility}
            setImage={setImage}
            title={title}
            value={value}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default registerForm2;

const styleSheat = StyleSheet.create({
  darkView: {
    flex: 1,
    backgroundColor: "#111827",
  },
  lightView: {
    flex: 1,
    backgroundColor: "#e2e8f0",
  },
  linkView: {
    justifyContent: "flex-start",
    width: "100%",
    marginBottom: 24,
    paddingHorizontal: "7%",
  },
  link: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "600",
    color: "#0c4eac",
  },
  darkText: {
    color: "#f1f5f9",
  },
  lightText: {
    color: "#111827",
  },
  mainView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoView: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    columnGap: 16,
  },
  logo: {
    width: 80,
    height: 80,
  },
  inputView: {
    width: "85%",
  },
  inputTitle: {
    fontSize: 18,
    lineHeight: 28,
  },
  input: {
    marginTop: 12,
  },
  button: {
    marginTop: 32,
  },
  buttonText: {
    fontSize: 20,
    lineHeight: 28,
  },
  snap: {
    fontFamily: "snap-itc",
  },
});
