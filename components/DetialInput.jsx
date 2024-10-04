import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import icons from "@/constants/icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Image } from "expo-image";

const DetialInput = ({ title, value, editable, handlePress }) => {
  const colorScheme = useColorScheme();

  const [visibility, setVisibility] = useState(false);

  return (
    <View style={styleSheat.mainView}>
      <Text
        style={[
          styleSheat.title,
          colorScheme === "dark" ? styleSheat.darkText : styleSheat.lightText,
        ]}
      >
        {title}
      </Text>
      <View style={styleSheat.inputView}>
        {title === "Password" ? (
          <>
            <TextInput
              style={[
                styleSheat.input,
                colorScheme === "dark"
                  ? styleSheat.darkText
                  : styleSheat.lightText,
              ]}
              value={value}
              editable={false}
              secureTextEntry={!visibility}
            />
            <TouchableHighlight
              style={styleSheat.eyeButton}
              activeOpacity={0.7}
              underlayColor={colorScheme === "dark" ? "#404040" : "#F1F1F1"}
              onPress={() => {
                setVisibility(!visibility);
              }}
            >
              <Image
                source={!visibility ? icons.eyeHide : icons.eye}
                contentFit="contain"
                style={[
                  styleSheat.eye,
                  { tintColor: colorScheme === "dark" ? "#fff" : "#0C4EAC" },
                ]}
              />
            </TouchableHighlight>
          </>
        ) : (
          <>
            <Text
              style={[
                styleSheat.input,
                colorScheme === "dark"
                  ? styleSheat.darkText
                  : styleSheat.lightText,
              ]}
            >
              {value}
            </Text>
            {editable && (
              <TouchableHighlight
                activeOpacity={0.7}
                style={styleSheat.editButton}
                underlayColor={colorScheme === "dark" ? "#404040" : "#F1F1F1"}
                onPress={handlePress}
              >
                <Image
                  source={icons.edit}
                  contentFit="contain"
                  style={[
                    styleSheat.edit,
                    { tintColor: colorScheme === "dark" ? "#fff" : "#0C4EAC" },
                  ]}
                />
              </TouchableHighlight>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default DetialInput;

const styleSheat = StyleSheet.create({
  mainView: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "600",
  },
  darkText: {
    color: "#f1f5f9",
  },
  lightText: {
    color: "#111827",
  },
  inputView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#6b7280",
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    fontWeight: "500",
    fontSize: 16,
  },
  eyeButton: {
    padding: 4,
    borderRadius: 9999,
  },
  eye: {
    width: 20,
    height: 20,
  },
  editButton: {
    padding: 8,
    borderRadius: 9999,
  },
  edit: {
    width: 16,
    height: 16,
  },
});
