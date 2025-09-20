import React from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/services/auth/auth";
import { LoginFormData, loginSchema } from "@/shared/schemas/auth";
import { useMainContext } from "@/providers/MainProvider";
import { Colors, gradients } from "@/constants/theme";
import { InputControlled } from "@/components/ui/input-controlled";

export default function LoginScreen() {
  const { them } = useMainContext();
  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: undefined,
      password: undefined,
    },
  });

  const loginMutation = useLogin();

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        Alert.alert("Uğur", "Sistemə uğurla daxil oldunuz!");
        router.replace("/(tabs)");
      },
      onError: (error: any) => {
        const message = error?.message || "Email və ya parol yanlışdır";
        Alert.alert("Xəta", message);
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
              <Ionicons name="person-circle-outline" size={80} color="#fff" />
            </View>
            <Text style={styles.title}>Xoş gəlmişsiniz</Text>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={300} duration={1000}>
            <LinearGradient
              colors={gradients[them].glass}
              style={styles.formContainer}
            >
              <InputControlled
                control={control}
                name="email"
                label="Email"
                placeholder="Email ünvanınızı daxil edin"
                keyboardType="email-address"
                leftIcon="mail-outline"
              />
              <InputControlled
                control={control}
                name="password"
                label="Şifrə"
                placeholder="Şifrənizi daxil edin"
                autoComplete="current-password"
                leftIcon={"lock-closed-outline"}
              />

              <Button
                title="Daxil ol"
                onPress={handleSubmit(onSubmit)}
                loading={loginMutation.isPending}
                style={styles.loginButton}
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
                title="Google ilə daxil ol"
                variant="outline"
                leftIcon={
                  <Ionicons name="logo-google" size={20} color="#667eea" />
                }
                style={styles.socialButton}
              />

              <View style={styles.footer}>
                <Text style={[styles.footerText, { color: Colors[them].text }]}>
                  Hesabınız yoxdur?
                </Text>
                <Link href="/auth/register" asChild>
                  <Text style={styles.linkText}>Qeydiyyatdan keç</Text>
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
    padding: 20,
    paddingVertical: 50,
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
  formContainer: {
    borderRadius: 20,
    padding: 24,
  },
  loginButton: {
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
