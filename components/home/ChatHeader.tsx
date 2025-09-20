import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useMainContext } from "@/providers/MainProvider";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

interface ChatHeaderProps {
  onMenuPress: () => void;
}

export function ChatHeader({ onMenuPress }: ChatHeaderProps) {
  const { them } = useMainContext();

  return (
    <View style={[styles.container, { backgroundColor: Colors[them].surface }]}>
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <Ionicons name="menu" size={24} color={Colors[them].text} />
      </TouchableOpacity>

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
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
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
