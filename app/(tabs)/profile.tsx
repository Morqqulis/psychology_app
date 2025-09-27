import { Colors } from "@/constants/theme";
import { useMainContext } from "@/providers/MainProvider";
import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

interface IprofileProps {}

export default function profile({}: IprofileProps) {
  const { setThem, them } = useMainContext();
  return (
    <View
      className="flex-1 py-6 px-2"
      style={[styles.container, { backgroundColor: Colors[them].background }]}
    >
      <Text
        className="text-2xl font-bold "
        style={{ color: Colors[them].text }}
      >
        Hesab idarə etmə səhifəsi
      </Text>
      <View className="flex-row gap-6 mt-20 border border-gray-400 p-2 w-full items-center">
        <Text
          className="text-lg font-semibold"
          style={{ color: Colors[them].text }}
        >
          Mövzu seç
        </Text>
        <Button title="Qaranlıq" onPress={() => setThem("dark")} />
        <Button title="İşıqlı" onPress={() => setThem("light")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
