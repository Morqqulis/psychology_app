import React, { useState } from "react";
import { TextInputProps } from "react-native";
import { Control, Controller } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "./input";
import { useMainContext } from "@/providers/MainProvider";
import { Colors } from "@/constants/theme";

interface CustomInputProps extends TextInputProps {
  control: Control<any>;
  name: string;
  defaultValue?: string;
  label?: string;
  placeholder?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  variant?: "default" | "primary";
}

export const InputControlled = ({
  control,
  name,
  defaultValue = "",
  label,
  placeholder,
  leftIcon,
  rightIcon,
  keyboardType = "default",
  autoCapitalize = "none",
  autoComplete = "off",
  variant = "default",
  ...props
}: CustomInputProps) => {
  const isPasswordField = ["password", "confirmPassword"].includes(name);
  const [show, setShow] = useState(!isPasswordField);
  const { them } = useMainContext();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Input
          label={label}
          error={error?.message}
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          variant={variant}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          textContentType={isPasswordField ? "password" : "none"}
          secureTextEntry={isPasswordField ? !show : false}
          autoComplete={autoComplete}
          leftIcon={
            leftIcon && (
              <Ionicons name={leftIcon} size={20} color={Colors[them].icon} />
            )
          }
          rightIcon={
            isPasswordField ? (
              <Ionicons
                name={show ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={Colors[them].icon}
                onPress={() => setShow(!show)}
              />
            ) : (
              <Ionicons name={rightIcon} size={20} color={Colors[them].icon} />
            )
          }
          {...props}
        />
      )}
    />
  );
};
