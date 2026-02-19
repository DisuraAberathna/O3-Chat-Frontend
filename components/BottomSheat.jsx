import { Image } from "expo-image";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import PrimaryInput from "@/components/PrimaryInput";
import PrimaryButton from "@/components/PrimaryButton";
import icons from "@/constants/icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { useAppAlert } from "./AlertProvider";
import { uploadToImgBB } from "../utils/imgbb";
import * as Progress from 'react-native-progress';

const BottomSheet = ({
  handlePress,
  visibility,
  setVisibility,
  image,
  setImage,
  autoSave,
  title,
  value,
  setValue,
  onSuccess,
}) => {
  const colorScheme = useColorScheme();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { showAlert } = useAppAlert();

  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [6, 6],
      quality: 0.5,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      setImage(selectedUri);
      if (autoSave) {
        saveImage(selectedUri);
      } else {
        setVisibility(false);
      }
    }
  };

  const pickImageFromCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [6, 6],
      quality: 0.5,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      setImage(selectedUri);
      if (autoSave) {
        saveImage(selectedUri);
      } else {
        setVisibility(false);
      }
    }
  };

  const saveImage = async (selectedImage) => {
    setIsProcessing(true);
    setUploadProgress(0);
    try {
      const uploadedUrl = await uploadToImgBB(selectedImage, (progress) => {
        setUploadProgress(progress);
      });

      // Update local storage
      const storedData = await AsyncStorage.getItem("user");
      if (storedData) {
        const user = JSON.parse(storedData);
        // Update Backend
        const response = await fetch(`${apiUrl}/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: user.id || user._id,
            profile_img: uploadedUrl,
          }),
        });

        if (response.ok) {
          user.profile_img = uploadedUrl;
          await AsyncStorage.setItem("user", JSON.stringify(user));
        } else {
          throw new Error("Failed to update profile image on server");
        }
      }

      showAlert("Information", "Profile image updated!", "success");
      onSuccess && onSuccess();
      setTimeout(() => {
        setVisibility(false);
      }, 1500);
      setIsProcessing(false);
      setUploadProgress(0);
    } catch (error) {
      console.error(error);
      showAlert("Error", error.message || "Failed to upload image", "error");
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  return (
    <Modal visible={visibility} transparent={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styleSheat.mainView}
      >
        <View
          style={[
            styleSheat.view,
            colorScheme === "dark" ? styleSheat.darkView : styleSheat.lightView,
          ]}
        >
          <View style={styleSheat.titleView}>
            <Text
              style={[
                styleSheat.title,
                colorScheme === "dark"
                  ? styleSheat.darkText
                  : styleSheat.lightText,
              ]}
            >
              {title === "Edit Profile Picture"
                ? "Edit Profile Picture"
                : title === "Profile Picture"
                  ? "Profile Picture"
                  : "Edit Details"}
            </Text>
            <TouchableHighlight
              activeOpacity={0.8}
              underlayColor={colorScheme === "dark" ? "#404040" : "#F1F1F1"}
              style={styleSheat.closeButton}
              onPress={() => {
                setVisibility(false);
              }}
            >
              <Image
                source={icons.close}
                contentFit="contain"
                style={styleSheat.closeIcon}
              />
            </TouchableHighlight>
          </View>
          {title === "Edit Profile Picture" || title === "Profile Picture" ? (
            <>
              <View style={styleSheat.imageChooserButtonView}>
                <TouchableHighlight
                  style={styleSheat.imageChooserButton}
                  underlayColor={colorScheme === "dark" ? "#404040" : "#F1F1F1"}
                  activeOpacity={0.8}
                  onPress={pickImageFromCamera}
                >
                  <Image
                    source={icons.camera}
                    style={[
                      styleSheat.imageChooserButtonIcon,
                      {
                        tintColor: colorScheme === "dark" ? "#fff" : "#0C4EAC",
                      },
                    ]}
                    contentFit="contain"
                  />
                </TouchableHighlight>
                <TouchableHighlight
                  style={styleSheat.imageChooserButton}
                  underlayColor={colorScheme === "dark" ? "#404040" : "#F1F1F1"}
                  activeOpacity={0.8}
                  onPress={pickImageFromGallery}
                >
                  <Image
                    source={icons.gallery}
                    style={[
                      styleSheat.imageChooserButtonIcon,
                      {
                        tintColor: colorScheme === "dark" ? "#fff" : "#0C4EAC",
                      },
                    ]}
                    contentFit="contain"
                  />
                </TouchableHighlight>
              </View>
              {autoSave && (
                <>
                  {isProcessing && uploadProgress > 0 && uploadProgress < 1 && (
                    <View style={{ width: 208, marginBottom: 10, alignItems: 'center' }}>
                      <Progress.Bar
                        progress={uploadProgress}
                        width={null}
                        color={colorScheme === "dark" ? "#fff" : "#0C4EAC"}
                        borderWidth={0}
                        unfilledColor={colorScheme === "dark" ? "#404040" : "#e2e8f0"}
                        style={{ width: "100%" }}
                      />
                      <Text style={[{ marginTop: 5 }, colorScheme === "dark" ? styleSheat.darkText : styleSheat.lightText]}>
                        Uploading... {Math.round(uploadProgress * 100)}%
                      </Text>
                    </View>
                  )}
                  <PrimaryButton
                    title={isProcessing ? "Processing..." : "Save Changes"}
                    containerStyles={{ width: 208 }}
                    handlePress={() => {
                      if (image) saveImage(image);
                      else showAlert("Warning", "Please select an image first", "warning");
                    }}
                    isLoading={isProcessing}
                  />
                </>
              )}
            </>
          ) : (
            <View style={styleSheat.buttonView}>
              <PrimaryInput
                title={title}
                value={value}
                handleChangeText={setValue}
              />
              {title === "Bio" && (
                <View style={styleSheat.suggestionsContainer}>
                  <Text style={[styleSheat.suggestionsTitle, colorScheme === "dark" ? styleSheat.darkText : styleSheat.lightText]}>
                    Suggestions:
                  </Text>
                  <View style={styleSheat.suggestionsList}>
                    {[
                      "Available",
                      "At work",
                      "In a meeting",
                      "Sleeping",
                      "Urgent calls only",
                    ].map((suggestion, index) => (
                      <TouchableHighlight
                        key={index}
                        style={[
                          styleSheat.suggestionChip,
                          colorScheme === "dark" ? styleSheat.darkChip : styleSheat.lightChip
                        ]}
                        underlayColor={colorScheme === "dark" ? "#404040" : "#e2e8f0"}
                        onPress={() => setValue(suggestion)}
                      >
                        <Text style={[styleSheat.suggestionText, colorScheme === "dark" ? styleSheat.darkText : styleSheat.lightText]}>
                          {suggestion}
                        </Text>
                      </TouchableHighlight>
                    ))}
                  </View>
                </View>
              )}
              <PrimaryButton
                title={isProcessing ? "Processing..." : "Save Changes"}
                containerStyles={styleSheat.button}
                handlePress={async () => {
                  setIsProcessing(true);
                  try {
                    await handlePress();
                  } catch (error) {
                    console.log(error);
                  } finally {
                    setIsProcessing(false);
                  }
                }}
                isLoading={isProcessing}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal >
  );
};

export default BottomSheet;

const styleSheat = StyleSheet.create({
  mainView: {
    justifyContent: "flex-end",
    height: "100%",
  },
  darkView: {
    backgroundColor: "#000",
    borderColor: "#0f172a",
  },
  lightView: {
    backgroundColor: "#fff",
    borderColor: "#cbd5e1",
  },
  view: {
    width: "100%",
    height: 320,
    alignItems: "center",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderWidth: 2,
    borderBottomWidth: 0,
  },
  titleView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    width: "100%",
  },
  title: {
    fontWeight: "700",
    fontSize: 20,
    lineHeight: 28,
  },
  closeButton: {
    padding: 8,
    borderRadius: 9999,
  },
  closeIcon: {
    width: 16,
    height: 16,
    tintColor: "#0C4EAC",
  },
  darkText: {
    color: "#cbd5e1",
  },
  lightText: {
    color: "#374151",
  },
  imageChooserButtonView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "80%",
  },
  imageChooserButton: {
    borderRadius: 12,
    padding: 12,
  },
  imageChooserButtonIcon: {
    width: 48,
    height: 48,
  },
  buttonView: {
    width: "85%",
    alignItems: "flex-end",
    marginTop: 12,
  },
  button: {
    width: 208,
    marginTop: 16,
  },
  suggestionsContainer: {
    width: '100%',
    marginTop: 10,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  suggestionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  darkChip: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  lightChip: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
  },
  suggestionText: {
    fontSize: 12,
  },
});
