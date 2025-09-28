import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FadeIn } from "../ui/FadeIn";

export function AppLoader() {
  return (
    <LinearGradient
      colors={["#101828", "#203c9d"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <FadeIn duration={420} style={styles.content}>
        <View style={styles.spinnerWrap}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
        <View style={styles.copyWrap}>
          <Text style={styles.title}>Preparing your experience</Text>
          <Text style={styles.caption}>
            Securely restoring your session and warming up recommendations.
          </Text>
        </View>
      </FadeIn>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  content: {
    alignItems: "center",
    gap: 16,
  },
  spinnerWrap: {
    height: 64,
    width: 64,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  copyWrap: {
    alignItems: "center",
    gap: 4,
  },
  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  caption: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 14,
    textAlign: "center",
  },
});
