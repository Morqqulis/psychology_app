import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { OpaqueColorValue, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";

interface ILoaderProps {
  size?: number;
  color?: string | OpaqueColorValue;
}

export default function Loader({ color, size }: ILoaderProps) {
  return (
    <Animatable.View
      animation="rotate"
      easing="linear"
      style={styles.container}
      iterationCount="infinite"
    >
      <Ionicons name="sync" size={size} color={color} />
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
