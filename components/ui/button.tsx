import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useMainContext } from "@/providers/MainProvider";
import { Colors, gradients } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import Loader from "../Loader";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "medium",
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  ...props
}) => {
  const { isDark, them } = useMainContext();

  const getButtonHeight = () => {
    switch (size) {
      case "small":
        return 40;
      case "large":
        return 60;
      default:
        return 50;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case "small":
        return 14;
      case "large":
        return 18;
      default:
        return 16;
    }
  };

  const isDisabled = disabled || loading;
  const color = Colors[them][variant];

  if (variant === "primary") {
    return (
      <TouchableOpacity
        style={[styles.button, { height: getButtonHeight() }, style]}
        disabled={isDisabled}
        {...props}
      >
        <LinearGradient
          colors={gradients[them].btnContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { borderRadius: 12 }]}
        >
          {leftIcon && !loading && leftIcon}
          {loading ? (
            <ActivityIndicator color={color} size="small" />
          ) : (
            <Text style={[styles.buttonText, { fontSize: getFontSize() }]}>
              {title}
            </Text>
          )}
          {rightIcon && !loading && rightIcon}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          height: getButtonHeight(),
          backgroundColor:
            variant === "secondary"
              ? isDark
                ? "#2a2a2a"
                : "#f8f9fa"
              : "transparent",
          borderWidth: variant === "outline" ? 1 : 0,
          borderColor: isDark ? "#404040" : "#e9ecef",
        },
        style,
      ]}
      disabled={isDisabled}
      {...props}
    >
      {leftIcon && !loading && leftIcon}
      {loading ? (
        <ActivityIndicator color={color} size="small" />
      ) : (
        <Text
          style={[styles.buttonText, { fontSize: getFontSize() }, { color }]}
        >
          {title}
        </Text>
      )}
      {rightIcon && !loading && rightIcon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    marginVertical: 8,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  buttonText: {
    fontWeight: "600",
    textAlign: "center",
    color: "#fff",
    marginHorizontal: 8,
  },
});
