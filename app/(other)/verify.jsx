import React, { useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import images from "@/constants/images";
import { Image } from "expo-image";
import PrimaryButton from "@/components/PrimaryButton";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const verify = () => {
  const colorScheme = useColorScheme();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleteOtp, setIsCompleteOtp] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [focusedInput, setFocusedInput] = useState(null);

  const inputs = useRef([]);

  const handleTextChange = (text, index) => {
    if (isNaN(Number(text))) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < inputs.current.length - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (newOtp.every((value) => value !== "")) {
      setIsCompleteOtp(true);
    } else {
      setIsCompleteOtp(false);
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const verify = async () => {
    if (isCompleteOtp) {
      setIsProcessing(true);
      try {
        const storedData = await AsyncStorage.getItem("not-verified-user");

        if (storedData !== null) {
          const not_verified_user = JSON.parse(storedData);

          const reqObject = {
            id: not_verified_user.userId,
            otp: otp.join(""),
          };

          const response = await fetch(`${apiUrl}/O3-Chat/Verify`, {
            method: "POST",
            body: JSON.stringify(reqObject),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();

            if (data.ok) {
              AsyncStorage.removeItem("not-verified-user");

              AsyncStorage.setItem("user", JSON.stringify(data.user));
              router.replace("home");
            } else {
              Alert.alert("Warning", data.msg);
            }
          } else {
            Alert.alert(
              "Error",
              "Verification failed \nCan not process this request!"
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
    } else {
      Alert.alert("Warning", "Please complete OTP");
    }
  };

  const resend = async () => {
    try {
      const storedData = await AsyncStorage.getItem("not-verified-user");

      if (storedData !== null) {
        const response = await fetch(`${apiUrl}/O3-Chat/ResendOTP`, {
          method: "POST",
          body: storedData,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();

          if (data.ok) {
            Alert.alert(
              "Information",
              "OTP send to your email. \nPlease check it."
            );
          } else {
            Alert.alert("Warning", data.msg);
          }
        } else {
          Alert.alert(
            "Error",
            "OTP resend failed \nCan not process this request!"
          );
          setIsProcessing(false);
        }
      } else {
        router.push("register-form-1");
      }
    } catch (error) {
      console.error(error);
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
              {otp.map((data, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputs.current[index] = ref)}
                  maxLength={1}
                  keyboardType="numeric"
                  value={data}
                  autoComplete="false"
                  onChangeText={(text) => handleTextChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  onFocus={() => setFocusedInput(index)}
                  style={[
                    styleSheat.input,
                    colorScheme === "dark"
                      ? styleSheat.darkBorder
                      : styleSheat.lightBorder,
                    colorScheme === "dark"
                      ? styleSheat.darkText
                      : styleSheat.lightText,
                    focusedInput === index && styleSheat.focusedInput,
                  ]}
                />
              ))}
            </View>
            <PrimaryButton
              title={isProcessing ? "Processing..." : "Verify"}
              containerStyles={styleSheat.button}
              textStyles={styleSheat.buttonText}
              handlePress={verify}
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
    height: 50,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600",
    borderWidth: 2,
    borderRadius: 12,
    textAlign: "center",
  },
  focusedInput: {
    borderColor: "#0C4EAC",
  },
  inputButtonView: {
    width: "85%",
    alignItems: "center",
  },
  button: {
    width: "100%",
    marginTop: 32,
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
