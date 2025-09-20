import Toast, {
  ToastPosition,
  ToastShowParams,
  ToastType,
} from "react-native-toast-message";
// import { createAudioPlayer } from "expo-audio";
import { Platform } from "react-native";

export async function showToast({
  title,
  message,
  options = {},
  position = "top",
  visibilityTime = 5000,
  topOffset = Platform.OS === "ios" ? 20 : 40,
  type = "info",
}: {
  title?: string;
  message?: string;
  options?: ToastShowParams;
  position?: ToastPosition;
  visibilityTime?: number;
  topOffset?: number;
  type?: ToastType;
}) {
  try {
    // const player = createAudioPlayer(
    //   require("../assets/sound/notification.mp3")
    // );
    // player.play();

    Toast.show({
      ...(title ? { text1: title } : {}),
      ...(message ? { text2: message } : {}),
      text2Style: {
        fontSize: 14,
        color: "#333",
      },
      text1Style: {
        fontSize: 14,
        fontWeight: "600",
      },
      type,
      position,
      visibilityTime,
      autoHide: true,
      topOffset,
      ...options,
    });
  } catch (error) {
    console.log("Error playing sound", error);
  }
}
