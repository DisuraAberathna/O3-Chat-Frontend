import {
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  StyleSheet,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryHeader from "@/components/PrimaryHeader";
import { router, useLocalSearchParams } from "expo-router";
import icons from "@/constants/icons";
import { useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";

const fqas = [
  {
    question: "How do I access my profile?",
    answer:
      "You can access your profile by tapping on the 'Profile' icon in the bottom navigation bar. This will open the 'User Profile' screen where you can view and edit your details.",
  },
  {
    question: "How can I update my profile?",
    answer:
      "Navigate to the 'Profile' section using the bottom menu. From there, you can update your username, first name, last name, bio, and contact details by clicking the pencil icon next to each field.",
  },
  {
    question: "How do I change my profile picture?",
    answer:
      "To change your profile picture, go to the 'Profile' section, click on the empty avatar at the top of the screen, and select a new image from your device's gallery.",
  },
  {
    question:
      "How do I update my personal details (Username, First Name, Last Name, Bio)?",
    answer:
      "You can update your personal information by navigating to the 'Profile' section. Tap on the pencil icon next to the detail you want to edit, enter your new information, and save the changes.",
  },
  {
    question: "How do I change my contact details?",
    answer:
      "In the 'Profile' section under 'Contact Details', tap the pencil icon next to your mobile number or email. Enter your updated contact information and save the changes.",
  },
  {
    question: "How do I change my password?",
    answer:
      "Navigate to the 'Security Details' section in the 'Profile' tab. Enter your new password in both the 'New Password' and 'Confirm Password' fields, then tap the 'Update' button to save the new password.",
  },
  {
    question: "How do I navigate between different sections of the app?",
    answer:
      "Use the navigation bar at the bottom of the screen to switch between the 'Home' and 'Profile' sections.",
  },
  {
    question: "How do I create a new chat?",
    answer:
      "To create a new chat, click on the three-dot menu in the top-right corner of the home screen, select 'New Chat,' and choose a contact from the list.",
  },
  {
    question: "Can I message myself?",
    answer:
      "Yes, you can send messages to yourself by selecting your own profile from the contact list in the 'New Chat' section. This is a handy feature for taking notes or saving information.",
  },
  {
    question: "How do I search for a contact?",
    answer:
      "Use the search option from the three-dot menu on the home screen to find a contact by their name.",
  },
  {
    question: "How do I sign out of O3 Chat?",
    answer:
      "To sign out, click on the three-dot menu in the top-right corner of the home screen or profile screen, and select 'Sign Out.'",
  },
  {
    question: "Is my data secure on O3 Chat?",
    answer:
      "Yes, O3 Chat takes your privacy and data security seriously. All messages are encrypted, and your personal information is kept safe and confidential.",
  },
  {
    question: "Can I customize my profile photo?",
    answer:
      "The ability to upload a profile photo is currently under development. Once available, you'll be able to personalize your account with your own image.",
  },
  {
    question: "What should I do if I encounter issues with the app?",
    answer:
      "If you experience any issues, navigate to the 'Help' option in the three-dot menu and follow the instructions for troubleshooting or contact customer support.",
  },
  {
    question: "What platforms does O3 Chat support?",
    answer:
      "O3 Chat is designed for mobile devices and is compatible with both Android and iOS platforms. Future updates will include desktop support.",
  },
];

const MenuItems = [
  {
    title: "Sign Out",
    handlePress: async () => {
      AsyncStorage.removeItem("user");
      router.replace("sign-in");
    },
  },
];

const Help = () => {
  const colorScheme = useColorScheme();

  const [idx, setIdx] = useState();
  const [visibility, setVisibility] = useState(false);

  const { back } = useLocalSearchParams();

  const AnswerView = ({ text, index }) => {
    return (
      <View
        style={[index !== idx && { display: "none" }, styleSheat.answerView]}
      >
        <Text
          style={[
            styleSheat.answer,
            colorScheme === "dark" ? styleSheat.darkText : styleSheat.lightText,
          ]}
        >
          {text}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={
        colorScheme === "dark"
          ? styleSheat.darkMainView
          : styleSheat.lightMainView
      }
    >
      <PrimaryHeader
        title="FAQs"
        back={true}
        backPress={() => {
          router.replace(back);
        }}
        menu={true}
        menuItems={MenuItems}
      />
      <ScrollView>
        {fqas.map((item, index) => (
          <View
            key={index}
            style={[
              styleSheat.mainView,
              colorScheme === "dark"
                ? styleSheat.darkView
                : styleSheat.lightView,
            ]}
          >
            <TouchableHighlight
              activeOpacity={0.8}
              style={styleSheat.questionButton}
              underlayColor={colorScheme === "dark" ? "#404040" : "#F1F1F1"}
              onPress={() => {
                if (idx === index && visibility === true) {
                  setVisibility(false);
                  setIdx();
                } else {
                  setVisibility(true);
                  setIdx(index);
                }
              }}
            >
              <>
                <Text
                  style={[
                    styleSheat.question,
                    colorScheme === "dark"
                      ? styleSheat.darkText
                      : styleSheat.lightText,
                  ]}
                >
                  {item.question}
                </Text>
                <Image
                  source={
                    idx === index && visibility === true
                      ? icons.minus
                      : icons.plus
                  }
                  style={[
                    styleSheat.icon,
                    { tintColor: colorScheme === "dark" && "#fff" },
                  ]}
                />
              </>
            </TouchableHighlight>
            {visibility && <AnswerView text={item.answer} index={index} />}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Help;

const styleSheat = StyleSheet.create({
  darkMainView: {
    flex: 1,
    backgroundColor: "#111827",
    paddingBottom: 8,
  },
  lightMainView: {
    flex: 1,
    backgroundColor: "#e2e8f0",
  },
  darkView: {
    backgroundColor: "#000",
  },
  lightView: {
    backgroundColor: "#fff",
  },
  mainView: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 12,
  },
  darkText: {
    color: "#f1f5f9",
  },
  lightText: {
    color: "#111827",
  },
  questionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    borderRadius: 12,
  },
  question: {
    flex: 1,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "600",
  },
  icon: {
    width: 20,
    height: 20,
  },
  answerView: {
    paddingTop: 4,
    paddingBottom: 8,
    paddingHorizontal: 12,
  },
  answer: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
});
