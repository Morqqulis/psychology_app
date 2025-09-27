import React, { useState, useEffect } from "react";
import { View, Text, Animated, StyleSheet, Dimensions } from "react-native";

let currentBadge: {
  show: (msg: string, position?: "top" | "bottom") => void;
} | null = null;

export const showBadge = (msg: string, position: "top" | "bottom" = "top") => {
  currentBadge?.show(msg, position);
};

export const BadgeToast: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [position, setPosition] = useState<"top" | "bottom">("top");
  const opacity = new Animated.Value(0);

  useEffect(() => {
    currentBadge = {
      show: (msg: string, pos: "top" | "bottom" = "top") => {
        setMessage(msg);
        setPosition(pos);
        setVisible(true);

        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            delay: 1200,
            useNativeDriver: true,
          }),
        ]).start(() => setVisible(false));
      },
    };
  }, []);

  if (!visible) return null;

  const topOffset = position === "top" ? 50 : undefined;
  const bottomOffset = position === "bottom" ? 50 : undefined;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        { top: topOffset, bottom: bottomOffset, opacity },
      ]}
    >
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: Dimensions.get("window").width,
    alignItems: "center",
    zIndex: 9999,
  },
  badge: {
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  badgeText: {
    color: "#fff",
    fontSize: 14,
  },
});
