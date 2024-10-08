import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import PrimaryInput from "@/components/PrimaryInput";
import PrimaryButton from "@/components/PrimaryButton";
import images from "@/constants/images";
import { Link, router } from "expo-router";
import { Image } from "expo-image";
import { containsNumbers, validatePassword } from "@/hooks/validation";

const registerForm1 = () => {
  const colorScheme = useColorScheme();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    checkStepDone();
  }, []);

  const checkStepDone = async () => {
    const storedData = await AsyncStorage.getItem("new-user");
    if (storedData !== null) {
      const userData = JSON.parse(storedData);
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setPassword(userData.password);
    }
  };

  const submit = async () => {
    if (firstName.length === 0) {
      Alert.alert("Warning", "Please enter your first name!");
    } else if (firstName.length < 3) {
      Alert.alert(
        "Warning",
        "Your first name must have more than 3 characters!"
      );
    } else if (firstName.length > 50) {
      Alert.alert(
        "Warning",
        "Your first name has exceeded the maximum character limit!"
      );
    } else if (containsNumbers(firstName)) {
      Alert.alert("Warning", "Your first name can not has numbers!");
    } else if (lastName.length === 0) {
      Alert.alert("Warning", "Please enter your last name!");
    } else if (lastName.length < 3) {
      Alert.alert(
        "Warning",
        "Your last name must have more than 3 characters!"
      );
    } else if (lastName.length > 50) {
      Alert.alert(
        "Warning",
        "Your last name has exceeded the maximum character limit!"
      );
    } else if (containsNumbers(lastName)) {
      Alert.alert("Warning", "Your last name can not has numbers!");
    } else if (password.length === 0) {
      Alert.alert("Warning", "Please enter your password!");
    } else if (password.length < 5) {
      Alert.alert("Warning", "Your password must have more than 5 characters!");
    } else if (password.length > 20) {
      Alert.alert(
        "Warning",
        "Your password has exceeded the maximum character limit!"
      );
    } else if (!validatePassword(password)) {
      Alert.alert("Warning", "Please add a strong password!");
    } else {
      setIsProcessing(true);

      const new_user = {
        firstName: firstName,
        lastName: lastName,
        password: password,
      };

      try {
        await AsyncStorage.setItem("new-user", JSON.stringify(new_user));
        await AsyncStorage.removeItem("remember-me");
        router.replace("register-form-2");
      } catch (error) {
        Alert.alert("Error", error);
      }
      setIsProcessing(false);
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
          <View style={styleSheat.inputView}>
            <Text
              style={[
                styleSheat.title,
                colorScheme === "dark"
                  ? styleSheat.darkText
                  : styleSheat.lightText,
              ]}
            >
              Register to <Text style={styleSheat.snap}>O3 Chat</Text>
            </Text>
            <PrimaryInput
              title="First Name"
              titleStyles={styleSheat.inputTitle}
              otherStyles={styleSheat.input}
              handleChangeText={setFirstName}
              value={firstName}
              maxLength={50}
            />
            <PrimaryInput
              title="Last Name"
              titleStyles={styleSheat.inputTitle}
              otherStyles={styleSheat.input}
              handleChangeText={setLastName}
              value={lastName}
              maxLength={50}
            />
            <PrimaryInput
              title="Password"
              titleStyles={styleSheat.inputTitle}
              otherStyles={styleSheat.input}
              maxLength={20}
              handleChangeText={setPassword}
              value={password}
            />
            <PrimaryButton
              title={isProcessing ? "Processing..." : "Continue"}
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
                Already have an account?
              </Text>
              <Link href="sign-in" style={styleSheat.link}>
                Sign In
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default registerForm1;

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
