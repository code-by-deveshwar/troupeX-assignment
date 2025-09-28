import { useRouter } from "expo-router";
import { useAuthStore } from "../src/store/authStore";
import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";

export default function OTPScreen() {
  const { verify } = useAuthStore();
  const [otp, setOtp] = useState("123456");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onVerify = async () => {
    try {
      setLoading(true);
      await verify(otp);
      router.replace("/feed");
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.message || e?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-6">
      <Text className="text-2xl font-bold mb-4">Enter OTP</Text>
      <TextInput
        value={otp}
        onChangeText={setOtp}
        placeholder="6-digit OTP"
        keyboardType="number-pad"
        className="border p-3 rounded mb-4"
      />
      <Button title={loading ? "Verifying..." : "Verify & Continue"} onPress={onVerify} />
    </View>
  );
}
