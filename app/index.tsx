import { useRouter } from "expo-router";
import { useAuthStore } from "../src/store/authStore";
import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";

export default function LoginScreen() {
  const { identifier, setIdentifier, login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onLogin = async () => {
    console.log("📨 Sending OTP request for:", identifier);

    try {
      setLoading(true);
      await login();
      console.log("✅ OTP request successful → navigating to OTP screen");
      router.push("/otp");
    } catch (e: any) {
      console.log("❌ OTP request error:", JSON.stringify(e, null, 2));
      Alert.alert("Error", e?.response?.data?.message || e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-6">
      <Text className="text-2xl font-bold mb-4">Login</Text>
      <TextInput
        value={identifier}
        onChangeText={setIdentifier}
        placeholder="Email or phone"
        autoCapitalize="none"
        keyboardType="email-address"
        className="border p-3 rounded mb-4"
      />
      <Button title={loading ? "Sending..." : "Send OTP"} onPress={onLogin} />
    </View>
  );
}
