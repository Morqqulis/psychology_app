import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useMainContext } from "@/providers/MainProvider";
import { Colors } from "@/constants/theme";
import AudioMsg from "./AudioMsg";
import { handleCopy } from "@/functions/helper";

interface ChatMessageProps {
  message: {
    id: string;
    text: string;
    isUser: boolean;
    type: "text" | "voice";
    timestamp: Date;
  };
  isNew?: boolean;
}

export function ChatMessage({ message, isNew = false }: ChatMessageProps) {
  const { them } = useMainContext();
  const slideAnim = useRef(new Animated.Value(isNew ? 50 : 0)).current;
  const opacityAnim = useRef(new Animated.Value(isNew ? 0 : 1)).current;

  useEffect(() => {
    if (isNew) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isNew]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          alignSelf: message.isUser ? "flex-end" : "flex-start",
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
          width: message.type === "voice" ? "100%" : "auto",
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onLongPress={() => {
          if (message.type === "text") {
            handleCopy(message.text);
          }
        }}
      >
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: message.isUser
                ? Colors[them].primary
                : Colors[them].bubble,
              marginLeft: message.isUser ? 60 : 0,
              marginRight: message.isUser ? 0 : 60,
            },
          ]}
        >
          {message.type === "text" ? (
            <Text
              style={[
                styles.text,
                {
                  color: message.isUser
                    ? Colors[them].white
                    : Colors[them].charcoal,
                },
              ]}
            >
              {message.text}
            </Text>
          ) : (
            <AudioMsg message={message} />
          )}

          <Text
            style={[
              styles.timestamp,
              {
                color: message.isUser
                  ? "rgba(255,255,255,0.7)"
                  : Colors[them].icon,
              },
            ]}
          >
            {message.timestamp.toLocaleTimeString("az-AZ", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: "80%",
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    textAlign: "right",
  },
});
