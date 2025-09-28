import React from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { Button } from "@/components/ui/button";
import { useRegister } from "@/services/auth/auth";
import { RegisterFormData, registerSchema } from "@/shared/schemas/auth";
import { useMainContext } from "@/providers/MainProvider";
import { Colors, gradients } from "@/constants/theme";
import { InputControlled } from "@/components/ui/input-controlled";
import GenderInput from "@/components/GenderInput";
import { showToast } from "@/hooks/useToast";

export default function RegisterScreen() {
  const { them } = useMainContext();

  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: undefined,
      surname: undefined,
      email: undefined,
      password: undefined,
      confirmPassword: undefined,
      gender: undefined,
    },
  });

  const registerMutation = useRegister();

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        showToast({
          title: "Uğurlu",
          message: "Hesab uğurla yaradıldı!",
          type: "success",
        });
        router.replace("/auth/login");
      },
      onError: (error: any) => {
        const message = error?.message || "Hesab yaradıla bilmədi";
        showToast({
          title: "Xəta",
          message,
          type: "error",
        });
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient colors={gradients[them].splash} style={styles.gradient}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            style={styles.headerContainer}
          >
            <View style={styles.logoContainer}>
              <Ionicons name="person-add" size={80} color="#fff" />
            </View>
            <Text style={styles.title}>Hesab yarat</Text>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={300} duration={1000}>
            <LinearGradient
              colors={gradients[them].glass}
              style={styles.formContainer}
            >
              <InputControlled
                control={control}
                name="name"
                label="Ad"
                placeholder="Adınızı daxil edin"
                leftIcon={"person-outline"}
                variant="primary"
                autoCapitalize="words"
              />

              <InputControlled
                control={control}
                name="surname"
                label="Soyad"
                placeholder="Soyadınızı daxil edin"
                variant="primary"
                leftIcon={"person-outline"}
                autoCapitalize="words"
              />

              <InputControlled
                control={control}
                name="email"
                label="Email"
                placeholder="Email ünvanınızı daxil edin"
                variant="primary"
                leftIcon={"mail-outline"}
                keyboardType="email-address"
              />

              <GenderInput
                control={control}
                name="gender"
                label="Cinsiyyət"
                variant="primary"
                placeholder="Cinsinizi seçin"
              />
              <InputControlled
                control={control}
                name="password"
                label="Şifrə"
                variant="primary"
                placeholder="Şifrənizi daxil edin"
                autoComplete="password"
                leftIcon={"lock-closed-outline"}
              />
              <InputControlled
                control={control}
                name="confirmPassword"
                label="Şifrəni təsdiq edin"
                placeholder="Şifrənizi təkrar daxil edin"
                autoComplete="password"
                leftIcon={"lock-closed-outline"}
                variant="primary"
              />

              <Text style={[styles.passwordHint, { color: Colors[them].text }]}>
                Şifrə ən azı 8 simvol, böyük və kiçik hərflər, rəqəmlər ehtiva
                etməlidir
              </Text>

              <Button
                title="Hesab yarat"
                onPress={handleSubmit(onSubmit)}
                loading={registerMutation.isPending}
                style={styles.registerButton}
              />

              <View style={styles.divider}>
                <View style={[styles.dividerLine]} />
                <Text
                  style={[styles.dividerText, { color: Colors[them].text }]}
                >
                  və ya
                </Text>
                <View style={[styles.dividerLine]} />
              </View>

              <Button
                title="Google ilə qeydiyyat"
                variant="outline"
                leftIcon={
                  <Ionicons name="logo-google" size={20} color="#667eea" />
                }
                style={styles.socialButton}
              />

              <View style={styles.footer}>
                <Text style={[styles.footerText, { color: Colors[them].text }]}>
                  Artıq hesabınız var?
                </Text>
                <Link href="/auth/login" asChild>
                  <Text style={styles.linkText}>Daxil ol</Text>
                </Link>
              </View>
            </LinearGradient>
          </Animatable.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 50,
    padding: 10,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  formContainer: {
    borderRadius: 20,
    padding: 24,
  },
  passwordHint: {
    fontSize: 12,
    marginBottom: 16,
    lineHeight: 16,
  },
  registerButton: {
    marginTop: 8,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ECEDEE",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  socialButton: {
    marginBottom: 24,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderColor: "#fff",
    borderWidth: 0.5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    color: "#667eea",
    fontWeight: "600",
  },
});
