import { Image } from "expo-image";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import PrimaryInput from "@/components/PrimaryInput";
import PrimaryButton from "@/components/PrimaryButton";
import icons from "@/constants/icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";

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
}) => {
  const colorScheme = useColorScheme();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const [isProcessing, setIsProcessing] = useState(false);

  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [6, 6],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickImageFromCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [6, 6],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const saveImage = async () => {
    setIsProcessing(true);
    try {
      const storedData = await AsyncStorage.getItem("user");

      if (storedData !== null) {
        const user = JSON.parse(storedData);

        const form = new FormData();
        form.append("id", user.id);
        form.append("image", {
          uri: image,
          type: "image/png",
          name: "avatar.png",
        });

        const response = await fetch(`${apiUrl}/o3_chat/SaveProfileImage`, {
          method: "POST",
          body: form,
        });

        if (response.ok) {
          const data = await response.json();

          if (data.ok) {
            Alert.alert("Information", "Profile image updated!");
            setVisibility(false);
          } else {
            Alert.alert("Warning", data.msg);
          }
        } else {
          Alert.alert(
            "Error",
            "Profile image update failed \nCan not process this request!"
          );
        }
      } else {
        router.replace("sign-in");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal visible={visibility} transparent={true}>
      <View style={styleSheat.mainView}>
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
                <PrimaryButton
                  title={isProcessing ? "Processing..." : "Save Changes"}
                  containerStyles={{ width: 208 }}
                  handlePress={saveImage}
                  isLoading={isProcessing}
                />
              )}
            </>
          ) : (
            <View style={styleSheat.buttonView}>
              <PrimaryInput
                title={title}
                value={value}
                handleChangeText={setValue}
              />
              <PrimaryButton
                title={isProcessing ? "Processing..." : "Save Changes"}
                containerStyles={styleSheat.button}
                handlePress={handlePress}
                isLoading={isProcessing}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
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
    height: 240,
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
});
