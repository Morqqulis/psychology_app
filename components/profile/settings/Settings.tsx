import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import ToggleTheme from "./ToggleTheme";

export default function Settings() {
  return (
    <ScrollView style={styles.container}>
      <ToggleTheme />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
});
