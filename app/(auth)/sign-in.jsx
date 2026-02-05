import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAppAlert } from "@/components/AlertProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import PrimaryInput from "@/components/PrimaryInput";
import PrimaryButton from "@/components/PrimaryButton";
import images from "@/constants/images";
import { Image } from "expo-image";
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

const signin = () => {
  const colorScheme = useColorScheme();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { showAlert } = useAppAlert();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    checkRemember();
  }, []);

  const checkRemember = async () => {
    const storedData = await AsyncStorage.getItem("remember-me");
    if (storedData !== null) {
      const userData = JSON.parse(storedData);
      setUsername(userData.username);
      setPassword(userData.password);
    }
  };

  const submit = async () => {
    if (username.length === 0) {
      showAlert("Warning", "Please enter your username!", "warning");
    } else if (password.length === 0) {
      showAlert("Warning", "Please enter your password!", "warning");
    } else {
      // Simulation
      setTimeout(async () => {
        const demoUser = {
          id: 1,
          username: username,
          f_name: "John",
          l_name: "Doe",
          email: "john@example.com",
          profile_img: "https://i.pravatar.cc/150?u=1",
        };

        if (rememberMe) {
          const rememberObject = {
            username: username,
            password: password,
          };
          await AsyncStorage.setItem("remember-me", JSON.stringify(rememberObject));
        } else {
          await AsyncStorage.removeItem("remember-me");
        }

        await AsyncStorage.removeItem("new-user");
        await AsyncStorage.setItem("user", JSON.stringify(demoUser));
        setIsProcessing(false);
        router.replace("home");
      }, 1000);
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
              <Text
                style={[
                  styleSheat.title,
                  colorScheme === "dark"
                    ? styleSheat.darkText
                    : styleSheat.lightText,
                ]}
              >
                Sign in to <Text style={styleSheat.snap}>O3 Chat</Text>
              </Text>
              <PrimaryInput
                title="Username"
                titleStyles={styleSheat.inputTitle}
                otherStyles={styleSheat.input}
                maxLength={20}
                handleChangeText={setUsername}
                value={username}
              />
              <PrimaryInput
                title="Password"
                titleStyles={styleSheat.inputTitle}
                otherStyles={styleSheat.input}
                maxLength={20}
                handleChangeText={setPassword}
                value={password}
              />
              <View style={styleSheat.checkboxView}>
                <Checkbox
                  style={styleSheat.checkbox}
                  value={rememberMe}
                  onValueChange={setRememberMe}
                  color={rememberMe ? "#0c4eac" : undefined}
                />
                <Text
                  style={[
                    styleSheat.checkboxText,
                    colorScheme === "dark"
                      ? styleSheat.darkText
                      : styleSheat.lightText,
                  ]}
                >
                  Remember Me
                </Text>
              </View>
              <PrimaryButton
                title={isProcessing ? "Processing..." : "Sign In"}
                containerStyles={styleSheat.button}
                textStyles={styleSheat.buttonText}
                handlePress={submit}
                isLoading={isProcessing}
              />
              <View style={styleSheat.linkView}>
                <Text
                  style={[
                    styleSheat.textLg,
                    colorScheme === "dark"
                      ? styleSheat.darkText
                      : styleSheat.lightText,
                  ]}
                >
                  Don't have an account?
                </Text>
                <Link href="register-form-1" style={styleSheat.link}>
                  Register
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default signin;

const styleSheat = StyleSheet.create({
  darkView: {
    flex: 1,
    backgroundColor: "#000000",
  },
  lightView: {
    flex: 1,
    backgroundColor: "#e2e8f0",
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
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600",
    marginTop: 32,
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
  checkboxView: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    paddingHorizontal: 8,
  },
  checkboxText: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "500",
  },
  checkbox: {
    borderRadius: 6,
  },
  button: {
    marginTop: 20,
  },
  buttonText: {
    fontSize: 20,
    lineHeight: 28,
  },
  linkView: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    columnGap: 8,
  },
  link: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "600",
    color: "#0c4eac",
  },
  textLg: {
    fontSize: 18,
    lineHeight: 28,
  },
  snap: {
    fontFamily: "snap-itc",
  },
});
