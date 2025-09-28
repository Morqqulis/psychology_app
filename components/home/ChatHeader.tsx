import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useMainContext } from "@/providers/MainProvider";
import { Colors } from "@/constants/theme";

export function ChatHeader() {
  const { them } = useMainContext();

  return (
    <View style={[styles.container, { backgroundColor: Colors[them].surface }]}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: Colors[them].text }]}>Psy</Text>
        <View
          style={[
            styles.onlineIndicator,
            { backgroundColor: Colors[them].success },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    // position: "relative",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginRight: 8,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    // position: "absolute",
    // right: -5,
    // top: 3,
  },
});
