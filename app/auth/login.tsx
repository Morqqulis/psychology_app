import React, { useState } from "react";
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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/services/auth/auth";
import { LoginFormData, loginSchema } from "@/shared/schemas/auth";
import { useMainContext } from "@/providers/MainProvider";

export default function LoginScreen() {
  const { isDark } = useMainContext();
  const [showPassword, setShowPassword] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLogin();

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        Alert.alert("Uğur", "Sistemə uğurla daxil oldunuz!");
        router.replace("/(tabs)");
      },
      onError: () => {
        Alert.alert("Xəta", "Yanlış email və ya şifrə");
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
        colors={isDark ? ["#1a1a2e", "#16213e"] : ["#667eea", "#764ba2"]}
        style={styles.gradient}
      >
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
            <Text style={styles.title}>Xoş gəlmisiniz</Text>
            <Text style={styles.subtitle}>Hesabınıza daxil olun</Text>
          </Animatable.View>

          <Animatable.View
            animation="fadeInUp"
            delay={300}
            duration={1000}
            style={[
              styles.formContainer,
              { backgroundColor: isDark ? "#2a2a2a" : "#fff" },
            ]}
          >
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="Email ünvanınızı daxil edin"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon={
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={isDark ? "#888" : "#666"}
                    />
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Şifrə"
                  placeholder="Şifrənizi daxil edin"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry={!showPassword}
                  autoComplete="current-password"
                  textContentType="password"
                  leftIcon={
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={isDark ? "#888" : "#666"}
                    />
                  }
                  rightIcon={
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={isDark ? "#888" : "#666"}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />
              )}
            />

            <Button
              title="Daxil ol"
              onPress={handleSubmit(onSubmit)}
              loading={loginMutation.isPending}
              style={styles.loginButton}
            />

            <View style={styles.divider}>
              <View
                style={[
                  styles.dividerLine,
                  { backgroundColor: isDark ? "#404040" : "#e9ecef" },
                ]}
              />
              <Text
                style={[
                  styles.dividerText,
                  { color: isDark ? "#888" : "#666" },
                ]}
              >
                və ya
              </Text>
              <View
                style={[
                  styles.dividerLine,
                  { backgroundColor: isDark ? "#404040" : "#e9ecef" },
                ]}
              />
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
              <Text
                style={[styles.footerText, { color: isDark ? "#888" : "#666" }]}
              >
                Hesabınız yoxdur?{" "}
              </Text>
              <Link href="/auth/register" asChild>
                <Text style={styles.linkText}>Qeydiyyatdan keç</Text>
              </Link>
            </View>
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
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
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  socialButton: {
    marginBottom: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
