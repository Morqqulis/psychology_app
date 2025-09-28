import { Colors } from "@/constants/theme";
import { useMainContext } from "@/providers/MainProvider";
import { useUserContext } from "@/providers/UserProvider";
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import { EditProfileFormData, editProfileSchema } from "@/shared/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import InfoCard from "./InfoCard";
import FormCard from "./FormCard";
import { useUpdateProfile } from "@/services/auth/user";
import { showToast } from "@/hooks/useToast";

export default function ProfileInfo() {
  const { them } = useMainContext();
  const { user, setUser } = useUserContext();
  const [type, setType] = useState<"view" | "edit">("view");
  const [loading, setLoading] = useState(false);
  const updateProfile = useUpdateProfile();

  const defaultValues = user
    ? {
        name: user.name,
        surname: user.surname,
        email: user.email,
        gender: user.gender,
      }
    : undefined;

  const { control, handleSubmit, reset } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues,
  });

  const onSubmit = (data: EditProfileFormData) => {
    if (!user) return;
    setLoading(true);
    updateProfile.mutate(
      { id: user.id, userData: data },
      {
        onSuccess: (updatedUser) => {
          setUser(updatedUser.doc);
          reset({
            name: updatedUser.doc.name,
            surname: updatedUser.doc.surname,
            email: updatedUser.doc.email,
            gender: updatedUser.doc.gender,
          });
          setLoading(false);
          showToast({
            message: "",
            title: "Məlumatlarınız yeniləndi",
            type: "success",
          });
          setType("view");
        },
        onError: (err: any) => {
          console.log(err);
          showToast({
            title: "Xəta",
            message: "Məlumatlarınız yenilənmədi",
            type: "error",
          });
          setLoading(false);
        },
      }
    );
  };

  const handleCancel = () => {
    reset(defaultValues);
    setType("view");
  };
  if (!user) {
    return (
      <View
        style={[styles.container, { backgroundColor: Colors[them].background }]}
      >
        <Text style={[styles.emptyText, { color: Colors[them].text }]}>
          İstifadəçi məlumatları tapılmadı
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: Colors[them].background }]}
      showsVerticalScrollIndicator={false}
    >
      <InfoCard
        handleCancel={handleCancel}
        type={type}
        setType={setType}
        handleSubmit={handleSubmit(onSubmit)}
        loading={loading}
      />
      <FormCard type={type} control={control} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  emptyText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
});
