import Loader from "@/components/Loader";
import { Colors } from "@/constants/theme";
import { useMainContext } from "@/providers/MainProvider";
import { useUserContext } from "@/providers/UserProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { Fragment } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface IInfoCardProps {
  handleCancel: () => void;
  type: "view" | "edit";
  setType: React.Dispatch<React.SetStateAction<"view" | "edit">>;
  handleSubmit: () => void;
  loading: boolean;
}

export default function InfoCard({
  handleCancel,
  setType,
  type,
  handleSubmit,
  loading,
}: IInfoCardProps) {
  const { them } = useMainContext();
  const { user } = useUserContext();
  if (!user) return <Fragment />;
  const color = Colors[them].text;
  return (
    <View
      style={[styles.profileCard, { backgroundColor: Colors[them].surface }]}
    >
      <View style={styles.avatarSection}>
        <View
          style={[styles.avatar, { backgroundColor: Colors[them].primary }]}
        >
          <Text style={[styles.avatarText, { color: Colors[them].background }]}>
            {user.name.charAt(0)}
            {user.surname.charAt(0)}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color }]}>
            {user.name} {user.surname}
          </Text>
          <Text style={[styles.userEmail, { color: Colors[them].icon }]}>
            {user.email}
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        {type === "view" ? (
          <TouchableOpacity
            style={[
              styles.editButton,
              { backgroundColor: Colors[them].primary },
            ]}
            onPress={() => setType("edit")}
          >
            <MaterialCommunityIcons
              name="pencil"
              size={20}
              color={Colors[them].background}
            />
            <Text
              style={[styles.buttonText, { color: Colors[them].background }]}
            >
              Düzəliş et
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={[
                styles.cancelButton,
                {
                  borderColor: Colors[them].charcoal,
                },
              ]}
              disabled={loading}
              onPress={handleCancel}
            >
              <Text style={[styles.cancelButtonText, { color }]}>Ləğv et</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveButton,
                { backgroundColor: Colors[them].success },
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <Loader color="white" size={20} />
              ) : (
                <Fragment>
                  <MaterialCommunityIcons
                    name="check"
                    size={20}
                    color={Colors[them].background}
                  />
                  <Text
                    style={[
                      styles.buttonText,
                      { color: Colors[them].background },
                    ]}
                  >
                    Saxla
                  </Text>
                </Fragment>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
  },
  actionButtons: {
    marginTop: 10,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  editActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
