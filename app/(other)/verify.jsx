import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import { useAppAlert } from "@/components/AlertProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import images from "@/constants/images";
import { Image } from "expo-image";
import PrimaryButton from "@/components/PrimaryButton";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const verify = () => {
  const colorScheme = useColorScheme();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { timer } = useLocalSearchParams();
  const { showAlert } = useAppAlert();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleteOtp, setIsCompleteOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const inputRef = useRef(null);

  const handleTextChange = (text) => {
    const cleanText = text.replace(/[^0-9]/g, "").slice(0, 6);
    setOtp(cleanText);
    setIsCompleteOtp(cleanText.length === 6);
  };

  useEffect(() => {
    let interval;

    const startTimer = async () => {
      if (isRunning && timeLeft > 0) {
        interval = setInterval(() => {
          setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
      } else if (timeLeft === 0) {
        clearInterval(interval);
        await AsyncStorage.removeItem("not-verified-user");
        router.replace("sign-in");
      }
    };

    if (timer === "true") {
      startTimer();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, timer]);

  useEffect(() => {
    if (timer === "true") {
      setIsRunning(true);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const verify = async () => {
    if (isCompleteOtp) {
      setIsProcessing(true);
      // Simulation
      setTimeout(async () => {
        await AsyncStorage.removeItem("not-verified-user");

        if (timer === "true") {
          await AsyncStorage.removeItem("remember-me");
          router.replace("sign-in");
        } else {
          const demoUser = {
            id: 1,
            username: "demo_user",
            f_name: "John",
            l_name: "Doe",
            email: "john@example.com",
            profile_img: "https://i.pravatar.cc/150?u=1",
          };
          await AsyncStorage.setItem("user", JSON.stringify(demoUser));
          router.replace("home");
        }
        setIsProcessing(false);
      }, 1000);
    } else {
      showAlert("Warning", "Please complete OTP", "warning");
    }
  };

  const resend = async () => {
    try {
      // Simulate Resend
      setTimeout(() => {
        showAlert(
          "Information",
          "OTP sent to your email (Demo). \nPlease check it.",
          "success"
        );
      }, 500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
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
            <View style={styleSheat.inputButtonView}>
              <Text
                style={[
                  styleSheat.title,
                  colorScheme === "dark"
                    ? styleSheat.darkText
                    : styleSheat.lightText,
                ]}
              >
                Verify Your Account
              </Text>
              <View style={styleSheat.inputView}>
                <TextInput
                  ref={inputRef}
                  value={otp}
                  onChangeText={handleTextChange}
                  maxLength={6}
                  keyboardType="numeric"
                  autoComplete="one-time-code"
                  textContentType="oneTimeCode"
                  underlineColorAndroid="transparent"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  style={styleSheat.hiddenInput}
                />
                {[0, 1, 2, 3, 4, 5].map((index) => {
                  const isCurrent = otp.length === index && isFocused;
                  const isFilled = otp.length > index;

                  return (
                    <TouchableHighlight
                      key={index}
                      onPress={() => inputRef.current?.focus()}
                      underlayColor="transparent"
                      style={[
                        styleSheat.input,
                        colorScheme === "dark"
                          ? styleSheat.darkBorder
                          : styleSheat.lightBorder,
                        (isCurrent || (index === 5 && otp.length === 6 && isFocused)) && styleSheat.focusedInput,
                      ]}
                    >
                      <Text
                        style={[
                          styleSheat.inputText,
                          colorScheme === "dark"
                            ? styleSheat.darkText
                            : styleSheat.lightText,
                        ]}
                      >
                        {otp[index] || ""}
                      </Text>
                    </TouchableHighlight>
                  );
                })}
              </View>
              {timer === "true" && (
                <Text
                  style={[
                    styleSheat.timerText,
                    colorScheme === "dark"
                      ? styleSheat.darkText
                      : styleSheat.lightText,
                  ]}
                >
                  {formatTime(timeLeft)}
                </Text>
              )}
              <PrimaryButton
                title={isProcessing ? "Processing..." : "Verify"}
                containerStyles={[
                  styleSheat.button,
                  timer !== "true" && { marginTop: 36 },
                ]}
                textStyles={styleSheat.buttonText}
                handlePress={verify}
                isLoading={isProcessing}
              />
              <TouchableHighlight
                style={styleSheat.otpButton}
                underlayColor={colorScheme === "dark" ? "#404040" : "#F1F1F1"}
                activeOpacity={0.7}
                onPress={resend}
              >
                <Text style={styleSheat.otpButtonText}>Resend OTP</Text>
              </TouchableHighlight>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default verify;

const styleSheat = StyleSheet.create({
  darkView: {
    flex: 1,
    backgroundColor: "#111827",
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
  snap: {
    fontFamily: "snap-itc",
  },
  inputView: {
    width: "85%",
    flexDirection: "row",
    columnGap: 10,
    paddingTop: 16,
  },
  darkBorder: {
    borderColor: "#d1d5db",
  },
  lightBorder: {
    borderColor: "#6b7280",
  },
  input: {
    flex: 1,
    height: 60,
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
  inputText: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  focusedInput: {
    borderColor: "#0C4EAC",
  },
  timerText: {
    marginVertical: 20,
  },
  inputButtonView: {
    width: "85%",
    alignItems: "center",
  },
  button: {
    width: "100%",
  },
  buttonText: {
    fontSize: 20,
    lineHeight: 28,
  },
  otpButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  otpButtonText: {
    color: "#0c4eac",
    fontWeight: "600",
  },
});
