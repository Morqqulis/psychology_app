import { Colors } from "@/constants/theme";
import { useMainContext } from "@/providers/MainProvider";
import { Ionicons } from "@expo/vector-icons";
import React, { Fragment, SetStateAction, useState } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Pressable,
} from "react-native";
import SlideModal from "./CustomSlideModal";
import { useUserContext } from "@/providers/UserProvider";
import { IProfileLabels, menuItems } from "@/shared/static/menu";
import { removeCookie } from "@/functions/cookieActions";
import { router } from "expo-router";
import { useLogout } from "@/services/auth/auth";

const labels = Object.keys(menuItems) as IProfileLabels[];
type IProps = {
  setSelectedLabel: React.Dispatch<SetStateAction<IProfileLabels>>;
  selectedLabel: IProfileLabels;
};
export default function Menu({ setSelectedLabel, selectedLabel }: IProps) {
  const [visible, setVisible] = useState(false);
  const { user, setUser } = useUserContext();
  const { them } = useMainContext();

  if (!user) return <></>;
  const { role, name, surname } = user;
  const color = them === "dark" ? Colors[them].text : Colors[them].blue;
  const logOut = async () => {
    await removeCookie("token");
    setUser(undefined);
    router.replace("/");
    // useLogout();
  };

  return (
    <Fragment>
      <TouchableOpacity
        onPress={() => setVisible(!visible)}
        style={styles.menuButton}
      >
        <Ionicons name="menu" size={24} color={color} />
      </TouchableOpacity>
      <SlideModal
        distance={85}
        direction="right"
        visible={visible}
        onClose={() => setVisible(false)}
        viewStyle={styles.content}
        overlayStyle={{ alignItems: "flex-end" }}
      >
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: `https://ui-avatars.com/api/?name=${name}+${surname}&background=818cf8&color=fff`,
            }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.userName}>
              {name} {surname}
            </Text>
          </View>
        </View>
        <View style={styles.menuList}>
          {labels.map((item) => {
            const isActive = item === selectedLabel;
            return (
              <Pressable
                key={item}
                onPress={() => {
                  setSelectedLabel(item);
                  setVisible(false);
                }}
                style={[
                  styles.option,
                  isActive && { backgroundColor: Colors[them].primary },
                ]}
              >
                <Text
                  style={[styles.optionText, isActive && styles.activeText]}
                >
                  {menuItems[item]}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logOut}>
          <Text style={styles.logoutText}>{"Çıxış"}</Text>
        </TouchableOpacity>
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
  content: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 15,
    backgroundColor: "#e9e9e9",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    gap: 12,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
  },

  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },

  menuList: {
    flexGrow: 1,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
  },

  optionText: {
    fontSize: 16,
    color: "#333",
  },

  activeText: {
    color: "#fff",
    fontWeight: "600",
  },

  logoutBtn: {
    marginBottom: 30,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#ff4d4d",
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
