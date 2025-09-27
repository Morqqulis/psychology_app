import { Colors } from "@/constants/theme";
import { useMainContext } from "@/providers/MainProvider";
import { Ionicons } from "@expo/vector-icons";
import React, { Fragment, useState } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import SlideModal from "./CustomSlideModal";

export default function Menu() {
  const [visible, setVisible] = useState(false);
  const { them } = useMainContext();
  return (
    <Fragment>
      <TouchableOpacity
        onPress={() => setVisible(!visible)}
        style={styles.menuButton}
      >
        <Ionicons name="menu" size={24} color={Colors[them].text} />
      </TouchableOpacity>
      <SlideModal
        distance={90}
        direction="left"
        visible={visible}
        onClose={() => setVisible(false)}
        viewStyle={styles.overlay}
      >
        <Text>Menu</Text>
      </SlideModal>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  overlay: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
});
