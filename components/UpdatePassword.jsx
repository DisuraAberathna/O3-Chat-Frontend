import React from "react";
import { StyleSheet, View } from "react-native";
import { useAppAlert } from "./AlertProvider";
import PrimaryInput from "./PrimaryInput";
import { useState } from "react";
import PrimaryButton from "./PrimaryButton";
import { validatePassword } from "@/hooks/validation";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UpdatePassword = ({ user }) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { showAlert } = useAppAlert();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const habndlePress = async () => {
    if (newPassword.length === 0) {
      showAlert("Warning", "Please enter your password!", "warning");
    } else if (newPassword.length < 5) {
      showAlert("Warning", "Your password must have more than 5 characters!", "warning");
    } else if (newPassword.length > 20) {
      showAlert(
        "Warning",
        "Your password has exceeded the maximum character limit!",
        "warning"
      );
    } else if (!validatePassword(newPassword)) {
      showAlert("Warning", "Please add a strong password!", "warning");
    } else if (newPassword !== confirmPassword) {
      showAlert("Warning", "Password mismatched!", "warning");
    } else {
      // Simulation
      setTimeout(async () => {
        const updatedUser = {
          userId: user.id,
          serverOTP: "123456",
          password: newPassword
        };

        await AsyncStorage.setItem(
          "not-verified-user",
          JSON.stringify(updatedUser)
        );
        await AsyncStorage.removeItem("user");

        showAlert("Information", "Verify it's you! (Demo OTP: 123456)", "info");

        setIsProcessing(false);
        router.replace({
          pathname: "verify",
          params: { timer: true },
        });
      }, 1000);
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
