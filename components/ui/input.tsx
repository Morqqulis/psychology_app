import React from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  StyleProp,
  TextStyle,
} from "react-native";
import { useMainContext } from "@/providers/MainProvider";
import { Colors } from "@/constants/theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<TextStyle>;
  secureTextEntry?: TextInputProps["secureTextEntry"];
  variant?: "default" | "primary";
}

export const Input = ({
  label,
  error,
  leftIcon,
  rightIcon,
  style,
  secureTextEntry,
  variant = "default",
  ...props
}: InputProps) => {
  const { them } = useMainContext();
  const { backgroundColor, color } =
    variant === "primary"
      ? {
          color: Colors[them].black,
          backgroundColor: Colors[them].light,
        }
      : {
          color: Colors[them].text,
          backgroundColor: Colors[them].surface,
        };

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color }]}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor,
            borderColor: error ? "#ff4757" : Colors[them].lightgray,
          },
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            { color, backgroundColor: "transparent" },
            secureTextEntry && styles.passwordInput,
            style,
          ]}
          placeholderTextColor={"#777"}
          secureTextEntry={secureTextEntry}
          passwordRules={secureTextEntry ? "minlength: 8;" : undefined}
          {...props}
        />
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 16,
  },
  passwordInput: {
    backgroundColor: "transparent",
  },
  iconLeft: {
    marginRight: 12,
  },
  iconRight: {
    marginLeft: 12,
  },
  errorText: {
    color: "#ff4757",
    fontSize: 14,
    marginTop: 4,
  },
});
