import { Colors } from "@/constants/theme";
import { addCookie } from "@/functions/cookieActions";
import { useMainContext } from "@/providers/MainProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function ToggleTheme() {
  const { them, setThem } = useMainContext();

  const toggleTheme = async () => {
    const newTheme = them === "light" ? "dark" : "light";
    setThem(newTheme);
    await addCookie("theme", newTheme);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: Colors[them].surface,
          borderColor: Colors[them].bubble,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="palette"
            size={24}
            color={Colors[them].primary}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: Colors[them].text }]}>
            Mövzu
          </Text>
          <Text style={[styles.subtitle, { color: Colors[them].icon }]}>
            {them === "light" ? "İşıqlı mövzu" : "Qaranlıq mövzu"}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={toggleTheme}
        style={[styles.themeButton, { backgroundColor: Colors[them].primary }]}
      >
        <MaterialCommunityIcons
          name={them === "light" ? "weather-night" : "weather-sunny"}
          size={20}
          color={Colors[them].white}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    marginHorizontal: 6,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
  },
  themeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
