import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import icons from "@/constants/icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Image } from "expo-image";

const PrimaryInput = ({
  title,
  value,
  placeholder,
  handleChangeText,
  titleStyles,
  otherStyles,
  ...props
}) => {
  const colorScheme = useColorScheme();

  const [focusedInput, setFocusedInput] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[otherStyles, styleSheat.mainView]}>
      <Text
        style={[
          titleStyles,
          colorScheme === "dark" ? styleSheat.darkText : styleSheat.lightText,
          styleSheat.title,
        ]}
      >
        {title}
      </Text>
      <View
        style={[
          colorScheme === "dark"
            ? styleSheat.darkBorder
            : styleSheat.lightBorder,
          styleSheat.inputView,
          focusedInput === title && styleSheat.focusedInput,
        ]}
      >
        <TextInput
          style={[
            colorScheme === "dark" ? styleSheat.darkText : styleSheat.lightText,
            styleSheat.input,
          ]}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          autoCorrect={false}
          underlineColorAndroid="transparent"
          secureTextEntry={
            (title === "Password" && !showPassword) ||
            (title === "New Password" && !showPassword) ||
            (title === "Confirm Password" && !showPassword)
          }
          onFocus={() => setFocusedInput(title)}
          onBlur={() => setFocusedInput(null)}
          {...props}
        />
        {(title === "Password" ||
          title === "New Password" ||
          title === "Confirm Password") && (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              activeOpacity={0.7}
            >
              <Image
                source={showPassword ? icons.eye : icons.eyeHide}
                contentFit="contain"
                style={[
                  styleSheat.eye,
                  { tintColor: colorScheme === "dark" ? "#fff" : "#0C4EAC" },
                ]}
              />
            </TouchableOpacity>
          )}
      </View>
    </View>
  );
};

export default PrimaryInput;

const styleSheat = StyleSheet.create({
  mainView: {
    rowGap: 4,
  },
  darkBorder: {
    borderColor: "#d1d5db",
  },
  lightBorder: {
    borderColor: "#6b7280",
  },
  darkText: {
    color: "#cbd5e1",
  },
  lightText: {
    color: "#374151",
  },
  title: {
    fontWeight: "600",
  },
  inputView: {
    width: "100%",
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  input: {
    flex: 1,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 24,
  },
  focusedInput: {
    borderColor: "#0C4EAC",
  },
  eye: {
    width: 24,
    height: 24,
  },
});
