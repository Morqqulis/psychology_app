import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import * as Animatable from "react-native-animatable";

import { Button } from "@/components/ui/button";
import { ThemedText } from "@/components/ui/themed-text";
import { router } from "expo-router";
import { useMainContext } from "@/providers/MainProvider";

export default function HomeScreen() {
  const { isDark } = useMainContext();
  return (
    <LinearGradient
      colors={
        isDark
          ? ["#1a1a2e", "#16213e", "#0f3460"]
          : ["#667eea", "#764ba2", "#f093fb"]
      }
      style={styles.container}
    >
      <View style={styles.content}>
        <Animatable.View
          animation="fadeInDown"
          duration={1000}
          style={styles.headerContainer}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="apps" size={80} color="#fff" />
          </View>
          <ThemedText style={[styles.title, { color: "#fff" }]}>
            Psixologiya Mərkəzi
          </ThemedText>
          <ThemedText className={`!text-green-500`} style={[styles.subtitle, { color: "#fff" }]}>
            Zehni sağlamlığınız bizim prioritetimizdir
          </ThemedText>
        </Animatable.View>

        <Animatable.View
          animation="fadeInUp"
          duration={1000}
          delay={300}
          style={styles.authContainer}
        >
          <Button
            title="Daxil ol"
            onPress={() => router.push("/auth/login")}
            // style={styles.authButton}
            variant="primary"
          />
          <Button
            title="Qeydiyyat"
            variant="outline"
            onPress={() => router.push("/auth/register")}
            style={[styles.authButton, styles.outlineButton]}
          />
        </Animatable.View>

        <Animatable.View
          animation="fadeIn"
          duration={1000}
          delay={600}
          style={styles.featuresContainer}
        >
          <View style={styles.featureItem}>
            <Ionicons name="shield-checkmark" size={24} color="#fff" />
            <ThemedText style={[styles.featureText, { color: "#fff" }]}>
              Təhlükəsiz və məxfi
            </ThemedText>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="people" size={24} color="#fff" />
            <ThemedText style={[styles.featureText, { color: "#fff" }]}>
              Peşəkar psixoloqlar
            </ThemedText>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="time" size={24} color="#fff" />
            <ThemedText style={[styles.featureText, { color: "#fff" }]}>
              24/7 dəstək
            </ThemedText>
          </View>
        </Animatable.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.9,
    paddingHorizontal: 20,
  },
  authContainer: {
    width: "100%",
    gap: 16,
    marginBottom: 40,
  },
  authButton: {
    width: "100%",
    paddingVertical: 16,
  },
  outlineButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "#fff",
    borderWidth: 1,
  },
  featuresContainer: {
    width: "100%",
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
  },
  featureText: {
    fontSize: 16,
    opacity: 0.9,
  },
});
