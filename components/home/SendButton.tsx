import { Colors } from "@/constants/theme";
import { useMainContext } from "@/providers/MainProvider";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface ISendButtonProps {
  type: "text" | "voice" | "record";
  setType: React.Dispatch<React.SetStateAction<"text" | "voice" | "record">>;
  handleSend: () => void;
}

export default function SendButton({
  type,
  setType,
  handleSend,
}: ISendButtonProps) {
  const { them } = useMainContext();
  return (
    <TouchableOpacity
      onPress={() => {
        if (type === "voice") {
          setType("record");
        } else {
          handleSend();
        }
      }}
      style={[
        styles.btn,
        {
          backgroundColor: Colors[them].primary,
        },
      ]}
    >
      <Ionicons
        name={type === "voice" ? "mic-outline" : "send"}
        size={20}
        color="white"
      />
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
