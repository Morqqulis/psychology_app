import { Colors } from "@/constants/theme";
import { useMainContext } from "@/providers/MainProvider";
import { IAiInputType } from "@/shared/interface";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface ISendButtonProps {
  type: IAiInputType;
  setType: React.Dispatch<React.SetStateAction<IAiInputType>>;
  handleSend: () => void;
  disabled?: boolean;
  isRecording?: boolean;
  hasText?: boolean;
  onStopRecording?: () => void;
  onStartRecording?: () => void;
  isTranscribing?: boolean;
}

export default function SendButton({
  type,
  setType,
  handleSend,
  disabled = false,
  isRecording = false,
  hasText = false,
  onStopRecording,
  onStartRecording,
  isTranscribing = false,
}: ISendButtonProps) {
  const { them } = useMainContext();

  const iconName =
    isRecording ? "stop" : hasText ? "send" : type === "voice" ? "mic-outline" : "send";

  return (
    <TouchableOpacity
      onPress={() => {
        if (disabled) return;
        if (isRecording) {
          onStopRecording?.();
          return;
        }
        if (!hasText && type === "voice") {
          onStartRecording?.();
          setType("record");
          return;
        }
        handleSend();
      }}
      disabled={disabled}
      style={[
        styles.btn,
        {
          backgroundColor: Colors[them].primary,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      {isTranscribing ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Ionicons
          name={iconName}
          size={20}
          color="white"
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});
