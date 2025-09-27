import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useMainContext } from "@/providers/MainProvider";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import Menu from "../Menu";

export function ChatHeader() {
  const { them } = useMainContext();

  return (
    <View style={[styles.container, { backgroundColor: Colors[them].surface }]}>
      <Menu />
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: Colors[them].text }]}>Psy</Text>
        <View
          style={[
            styles.onlineIndicator,
            { backgroundColor: Colors[them].success },
          ]}
        />
      </View>

      <View style={styles.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  },
  placeholder: {
    width: 40,
  },
});
