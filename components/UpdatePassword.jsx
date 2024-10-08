import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import PrimaryInput from "./PrimaryInput";
import { useState } from "react";
import PrimaryButton from "./PrimaryButton";
import { validatePassword } from "@/hooks/validation";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UpdatePassword = ({ user }) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const habndlePress = async () => {
    if (newPassword.length === 0) {
      Alert.alert("Warning", "Please enter your password!");
    } else if (newPassword.length < 5) {
      Alert.alert("Warning", "Your password must have more than 5 characters!");
    } else if (newPassword.length > 20) {
      Alert.alert(
        "Warning",
        "Your password has exceeded the maximum character limit!"
      );
    } else if (!validatePassword(newPassword)) {
      Alert.alert("Warning", "Please add a strong password!");
    } else if (newPassword !== confirmPassword) {
      Alert.alert("Warning", "Password mismatched!");
    } else {
      setIsProcessing(true);

      const reqObject = {
        password: newPassword,
        confirmPassword: confirmPassword,
        user: user.id,
      };

      try {
        const response = await fetch(`${apiUrl}/O3-Chat/UpdatePaasword`, {
          method: "POST",
          body: JSON.stringify(reqObject),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();

          if (data.ok) {
            await AsyncStorage.setItem(
              "not-verified-user",
              JSON.stringify(data.user)
            );
            await AsyncStorage.removeItem("user");

            Alert.alert("Information", "Verify it's you!", [
              {
                text: "OK",
                onPress: () => {
                  router.replace({
                    pathname: "verify",
                    params: { timer: true },
                  });
                },
              },
            ]);
          } else {
            Alert.alert("Warning", data.msg);
          }
        } else {
          Alert.alert(
            "Error",
            "Password update failed \nCan not process this request!"
          );
          setIsProcessing(false);
        }
      } catch (error) {
        console.log(error);
      }
      setIsProcessing(false);
    }
  };

  return (
    <View style={styleSheat.view}>
      <PrimaryInput
        title="New Password"
        titleStyles={styleSheat.inputTitle}
        otherStyles={styleSheat.input}
        maxLength={20}
        handleChangeText={setNewPassword}
        value={newPassword}
      />
      <PrimaryInput
        title="Confirm Password"
        titleStyles={styleSheat.inputTitle}
        otherStyles={styleSheat.input}
        maxLength={20}
        handleChangeText={setConfirmPassword}
        value={confirmPassword}
      />
      <View style={styleSheat.buttonView}>
        <PrimaryButton
          title="Update"
          containerStyles={styleSheat.button}
          textStyles={styleSheat.buttonText}
          handlePress={habndlePress}
          isLoading={isProcessing}
        />
      </View>
    </View>
  );
};

export default UpdatePassword;

const styleSheat = StyleSheet.create({
  view: {
    paddingTop: 4,
    paddingBottom: 8,
    paddingHorizontal: 12,
  },
  inputTitle: {
    fontSize: 18,
    lineHeight: 28,
  },
  input: {
    marginTop: 12,
  },
  buttonView: {
    alignItems: "center",
  },
  button: {
    width: "60%",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    lineHeight: 28,
  },
});
