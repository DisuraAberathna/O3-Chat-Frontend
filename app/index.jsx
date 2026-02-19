import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PrimaryButton from "@/components/PrimaryButton";
import images from "@/constants/images";
import { Image } from "expo-image";

const index = () => {
  const colorScheme = useColorScheme();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      if (await AsyncStorage.getItem("user")) {
        router.replace("home");
      } else if (await AsyncStorage.getItem("new-user")) {
        router.replace("register-form-1");
      } else if (await AsyncStorage.getItem("not-verified-user")) {
        router.replace({
          pathname: "verify",
          params: { timer: false },
        });
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const submit = () => {
    router.replace("sign-in");
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          colorScheme === "dark" ? styleSheat.darkView : styleSheat.lightView,
          { justifyContent: "center", alignItems: "center" }
        ]}
      >
        <Image
          source={images.logo}
          style={{ width: 100, height: 100, marginBottom: 20 }}
          contentFit="contain"
        />
        <ActivityIndicator size="large" color="#0C4EAC" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={
        colorScheme === "dark" ? styleSheat.darkView : styleSheat.lightView
      }
    >
      <ScrollView contentContainerStyle={{ minHeight: "100%" }}>
        <View style={styleSheat.mainView}>
          <View style={styleSheat.logoView}>
            <Image
              source={images.logo}
              style={styleSheat.logo}
              contentFit="contain"
            />
            <View style={styleSheat.welcomeTextView}>
              <Text
                style={[
                  styleSheat.welcomeText,
                  colorScheme === "dark"
                    ? styleSheat.darkText
                    : styleSheat.lightText,
                ]}
              >
                Welcome to <Text style={styleSheat.snap}>O3 Chat</Text>
              </Text>
              <Text
                style={[
                  styleSheat.subText,
                  colorScheme === "dark"
                    ? styleSheat.darkText
                    : styleSheat.lightText,
                ]}
              >
                Simply chat with click{" "}
                <Text style={styleSheat.boldText}>Continue</Text>.
              </Text>
            </View>
          </View>
          <View style={{ paddingBottom: 50, width: "100%" }}>
            <PrimaryButton
              title={"Continue"}
              handlePress={submit}
              containerStyles={styleSheat.button}
              textStyles={styleSheat.buttonText}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;

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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 80,
  },
  logoView: {
    alignItems: "center",
    width: "100%",
  },
  logo: {
    width: 80,
    height: 80,
  },
  welcomeTextView: {
    position: "relative",
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "600",
    textAlign: "center",
  },
  subText: {
    textAlign: "center",
    fontWeight: "500",
    marginTop: 12,
  },
  boldText: {
    fontWeight: "800",
  },
  button: {
    width: "100%",
  },
  buttonText: {
    fontSize: 20,
    lineHeight: 28,
  },
  snap: {
    fontFamily: "snap-itc",
  },
});
