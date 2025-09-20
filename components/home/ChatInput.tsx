import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from "react-native";
import { useMainContext } from "@/providers/MainProvider";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { VoiceRecording } from "./VoiceRecording";
import SendButton from "./SendButton";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
  createAudioPlayer,
} from "expo-audio";
import { showToast } from "@/hooks/useToast";

interface ChatInputProps {
  onSendMessage: (message: string, isVoice?: boolean) => void;
  disabled: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const { them } = useMainContext();
  const [type, setType] = useState<"text" | "voice" | "record">("voice");
  const [message, setMessage] = useState("");
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);

  const handleSend = async () => {
    if (message.trim() && !disabled && type === "text") {
      onSendMessage(message.trim());
      setMessage("");
      setType("voice");
    }
    if (!disabled && type === "record") {
      const uri = await stop();
      setMessage("");
      setType("voice");
      if (uri) {
        onSendMessage(uri, true);
      } else {
        showToast({
          title: "Səhv",
          message: "Səsli mesaj göndərilmədi",
          type: "error",
        });
      }
    }
  };
  const stop = async () => {
    if (recorderState.isRecording) {
      await recorder.stop();
    }

    return recorderState.url;
    
  };

  const cancelVoiceRecording = () => {
    setType("voice");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={[styles.container]}>
        <View style={[styles.inputContainer]}>
          {type === "record" ? (
            <VoiceRecording
              onCancel={cancelVoiceRecording}
              recorder={recorder}
              recorderState={recorderState}
            />
          ) : (
            <TextInput
              style={[styles.textInput]}
              value={message}
              onChangeText={(text) => {
                setMessage(text);
                if (text.trim()) {
                  setType("text");
                } else {
                  setType("voice");
                }
              }}
              placeholder="Mesaj yazın..."
              placeholderTextColor={Colors[them].icon}
              multiline
              maxLength={1000}
              editable={!disabled}
            />
          )}
        </View>

        <SendButton type={type} setType={setType} handleSend={handleSend} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 5,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#1f2937",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginRight: 8,
    maxHeight: 100,
    backgroundColor: "#f9fafb",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingRight: 8,
    maxHeight: 80,
    color: "#1a1a1a",
  },
});
