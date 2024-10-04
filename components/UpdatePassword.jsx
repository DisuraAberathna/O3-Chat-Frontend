import React from "react";
import { StyleSheet, View } from "react-native";
import PrimaryInput from "./PrimaryInput";
import { useState } from "react";
import PrimaryButton from "./PrimaryButton";

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
