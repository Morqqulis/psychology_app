import React, { forwardRef, useState } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { useMainContext } from "@/providers/MainProvider";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    { label, error, leftIcon, rightIcon, style, secureTextEntry, ...props },
    ref
  ) => {
    const { isDark } = useMainContext();
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View style={styles.container}>
        {label && (
          <Text style={[styles.label, { color: isDark ? "#fff" : "#333" }]}>
            {label}
          </Text>
        )}
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: isDark ? "#2a2a2a" : "#fff",
              borderColor: error
                ? "#ff4757"
                : isFocused
                ? "#667eea"
                : isDark
                ? "#404040"
                : "#e9ecef",
            },
            isFocused && styles.inputContainerFocused,
          ]}
        >
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <TextInput
            ref={ref}
            style={[
              styles.input,
              {
                color: isDark ? "#fff" : "#333",
                backgroundColor: "transparent",
              },
              secureTextEntry && styles.passwordInput,
              style,
            ]}
            placeholderTextColor={isDark ? "#888" : "#666"}
            secureTextEntry={secureTextEntry}
            autoComplete={secureTextEntry ? "current-password" : "off"}
            textContentType={secureTextEntry ? "password" : "none"}
            passwordRules={secureTextEntry ? "minlength: 6;" : undefined}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

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
  inputContainerFocused: {
    borderWidth: 2,
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 16,
  },
  passwordInput: {
    backgroundColor: "transparent",
    color: "inherit",
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
