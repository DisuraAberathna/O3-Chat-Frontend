import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";

const PrimaryButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[
        styleSheat.button,
        isLoading && styleSheat.opacity,
        containerStyles,
      ]}
      disabled={isLoading}
      activeOpacity={0.8}
      onPress={handlePress}
      {...props}
    >
      <Text style={[styleSheat.text, textStyles]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;

const styleSheat = StyleSheet.create({
  button: {
    backgroundColor: "#0c4eac",
    borderRadius: 16,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  opacity: {
    opacity: 0.5,
  },
  text: {
    color: "#fff",
    fontWeight: 500,
  },
});
