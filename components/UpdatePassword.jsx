import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useAppAlert } from "./AlertProvider";
import PrimaryInput from "./PrimaryInput";
import PasswordStrength from "./PasswordStrength";
import { useState } from "react";
import PrimaryButton from "./PrimaryButton";
import { validatePassword } from "@/hooks/validation";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UpdatePassword = ({ user }) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { showAlert } = useAppAlert();

  const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify OTP, 3: Update Password
  const [otp, setOtp] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const sendOtp = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${apiUrl}/send-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id || user.id }),
      });

      if (response.ok) {
        showAlert("Information", "OTP sent to your email!", "success");
        setStep(2);
      } else {
        showAlert("Error", "Failed to send OTP", "error");
      }
    } catch (error) {
      console.log(error);
      showAlert("Error", "Network error", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      showAlert("Warning", "Please enter a valid 6-digit OTP", "warning");
      return;
    }
    setIsProcessing(true);
    try {
      const response = await fetch(`${apiUrl}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user._id || user.id,
          otp: parseInt(otp, 10),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.ok || result.ok === undefined) { // adjust based on actual verify response structure
          showAlert("Success", "OTP Verified!", "success");
          setStep(3);
        } else {
          showAlert("Error", result.msg || "Invalid OTP", "error");
        }
      } else {
        showAlert("Error", "Invalid OTP", "error");
      }
    } catch (error) {
      console.log(error);
      showAlert("Error", "Network error", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePress = async () => {
    if (newPassword.length === 0) {
      showAlert("Warning", "Please enter your password!", "warning");
    } else if (newPassword.length < 5) {
      showAlert("Warning", "Your password must have more than 5 characters!", "warning");
    } else if (newPassword.length > 20) {
      showAlert("Warning", "Your password has exceeded the maximum character limit!", "warning");
    } else if (!validatePassword(newPassword)) {
      showAlert("Warning", "Please add a strong password!", "warning");
    } else if (newPassword !== confirmPassword) {
      showAlert("Warning", "Password mismatched!", "warning");
    } else {
      setIsProcessing(true);
      try {
        const response = await fetch(`${apiUrl}/update-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user._id || user.id,
            currentPassword: oldPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.ok) {
            showAlert("Success", "Password updated successfully!", "success");
            // Reset state
            setStep(1);
            setNewPassword("");
            setConfirmPassword("");
            setOldPassword("");
            setOtp("");
          } else {
            showAlert("Error", result.msg || "Update failed", "error");
          }
        } else {
          const errorText = await response.text();
          try {
            const errorJson = JSON.parse(errorText);
            showAlert("Error", errorJson.msg || "Update failed", "error");
          } catch (e) {
            showAlert("Error", "Update failed", "error");
          }
        }
      } catch (error) {
        console.log(error);
        showAlert("Error", "Network error", "error");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <View style={styleSheat.view}>
      {step === 1 && (
        <View style={styleSheat.stepContainer}>
          <Text style={[styleSheat.instructionText, { color: '#6b7280' }]}>
            To change your password, first verify your identity by requesting an OTP.
          </Text>
          <PrimaryButton
            title="Send OTP"
            containerStyles={styleSheat.button}
            handlePress={sendOtp}
            isLoading={isProcessing}
          />
        </View>
      )}

      {step === 2 && (
        <View style={styleSheat.stepContainer}>
          <PrimaryInput
            title="Enter OTP"
            titleStyles={styleSheat.inputTitle}
            otherStyles={styleSheat.input}
            maxLength={6}
            keyboardType="numeric"
            handleChangeText={setOtp}
            value={otp}
          />
          <PrimaryButton
            title="Verify OTP"
            containerStyles={styleSheat.button}
            handlePress={verifyOtp}
            isLoading={isProcessing}
          />
        </View>
      )}

      {step === 3 && (
        <>
          <PrimaryInput
            title="Old Password"
            titleStyles={styleSheat.inputTitle}
            otherStyles={styleSheat.input}
            maxLength={20}
            handleChangeText={setOldPassword}
            value={oldPassword}
          />
          <PrimaryInput
            title="New Password"
            titleStyles={styleSheat.inputTitle}
            otherStyles={styleSheat.input}
            maxLength={20}
            handleChangeText={setNewPassword}
            value={newPassword}
          />
          <PasswordStrength password={newPassword} />
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
              handlePress={handlePress}
              isLoading={isProcessing}
            />
          </View>
        </>
      )}
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
  instructionText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  stepContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
  },
});
