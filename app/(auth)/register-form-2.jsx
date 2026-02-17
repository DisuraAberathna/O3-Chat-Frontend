import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAppAlert } from "@/components/AlertProvider";
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
import { uploadToImgBB } from "../../utils/imgbb";
import * as Progress from 'react-native-progress';

const registerForm2 = () => {
  const colorScheme = useColorScheme();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { showAlert } = useAppAlert();

  const [image, setImage] = useState(null);
  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [bottomSheetVisibility, setBottomSheetVisibility] = useState(false);
  const [title, setTitle] = useState();
  const [value, setValue] = useState();
  const [uploadProgress, setUploadProgress] = useState(0);

  const submit = async () => {
    if (image === null) {
      showAlert("Warning", "Please select a profile picture!", "warning");
    } else if (mobile.length === 0) {
      showAlert("Warning", "Please enter your mobile number!", "warning");
    } else if (!validateMobile(mobile)) {
      showAlert("Warning", "Please enter valid mobile number! \n07********", "warning");
    } else if (username.length === 0) {
      showAlert("Warning", "Please enter your username!", "warning");
    } else if (username.length < 3) {
      showAlert("Warning", "Your username must have more than 3 characters!", "warning");
    } else if (username.length > 20) {
      showAlert(
        "Warning",
        "Your username has exceeded the maximum character limit!",
        "warning"
      );
    } else if (email.length === 0) {
      showAlert("Warning", "Please enter your email!", "warning");
    } else if (!validateEmail(email)) {
      showAlert("Warning", "Please enter valid email!", "warning");
    } else if (email.length > 100) {
      showAlert(
        "Warning",
        "Your email has exceeded the maximum character limit!",
        "warning"
      );
    } else {
      setIsProcessing(true);
      setUploadProgress(0);

      try {
        // Retrieve data from Step 1
        const storedData = await AsyncStorage.getItem("new-user");
        if (!storedData) {
          showAlert("Error", "Please go back and fill in the previous form.", "error");
          setIsProcessing(false);
          return;
        }
        const step1Data = JSON.parse(storedData);

        let uploadedImageUrl = null;
        if (image) {
          uploadedImageUrl = await uploadToImgBB(image, (progress) => {
            setUploadProgress(progress);
          });
        }

        const reqObject = {
          f_name: step1Data.firstName,
          l_name: step1Data.lastName,
          password: step1Data.password,
          mobile: mobile,
          username: username,
          email: email,
          profile_img: uploadedImageUrl
        };

        const response = await fetch(`${apiUrl}/register`, {
          method: "POST",
          body: JSON.stringify(reqObject),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();

          await AsyncStorage.removeItem("new-user");
          await AsyncStorage.setItem("not-verified-user", JSON.stringify({ email: email }));

          showAlert(
            "Information",
            "Verification code sent to your email!",
            "success"
          );

          setIsProcessing(false);
          setUploadProgress(0);
          router.replace({
            pathname: "verify",
            params: { timer: false },
          });
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.log(`Registration Error: Status ${response.status}`, JSON.stringify(errorData));
          showAlert("Error", errorData.msg || "Registration failed", "error");
          setIsProcessing(false);
          setUploadProgress(0);
        }

      } catch (error) {
        console.error(error);
        showAlert("Error", "Failed to register user. Check your connection.", "error");
        setIsProcessing(false);
        setUploadProgress(0);
      }
    }
  };

  return (
    <SafeAreaView
      style={
        colorScheme === "dark" ? styleSheat.darkView : styleSheat.lightView
      }
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
              <View style={{ width: "100%", alignItems: "center" }}>
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
              {isProcessing && uploadProgress > 0 && uploadProgress < 1 && (
                <View style={{ width: "100%", marginTop: 20, alignItems: 'center' }}>
                  <Progress.Bar
                    progress={uploadProgress}
                    width={null}
                    color={colorScheme === "dark" ? "#fff" : "#0C4EAC"}
                    borderWidth={0}
                    unfilledColor={colorScheme === "dark" ? "#404040" : "#e2e8f0"}
                    style={{ width: "100%" }}
                  />
                  <Text style={[{ marginTop: 5 }, colorScheme === "dark" ? styleSheat.darkText : styleSheat.lightText]}>
                    Uploading... {Math.round(uploadProgress * 100)}%
                  </Text>
                </View>
              )}
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
      </KeyboardAvoidingView>
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
