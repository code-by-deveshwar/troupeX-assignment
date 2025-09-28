import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../src/store/authStore";
import { Screen } from "../src/components/layout/Screen";
import { Card } from "../src/components/ui/Card";
import { PrimaryButton } from "../src/components/ui/PrimaryButton";

export default function LoginScreen() {
  const { identifier, setIdentifier, login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIdentifier(identifier?.trim() ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLogin = async () => {
    if (!identifier.trim()) {
      Alert.alert("Heads up", "Enter your email or phone number to get started.");
      return;
    }

    try {
      setLoading(true);
      await login();
      router.push("/otp");
    } catch (e: any) {
      Alert.alert(
        "We couldn't reach your account",
        e?.response?.data?.message || e?.message || "Please try again in a few moments."
      );
    } finally {
      setLoading(false);
    }
  };

  const helperCopy = inputFocused
    ? "We’ll send a secure sign-in link or OTP."
    : "Welcome back! Sign in to reconnect with your professional circle.";

  return (
    <Screen edges={["top", "bottom", "left", "right"]} className="bg-transparent">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View className="mb-32 px-6 gap-3">
          <View className="self-start rounded-full bg-white/50 px-4 py-1 mt-20">
            <Text className="text-xs font-semibold text-primary-700 uppercase tracking-[0.2em]">
              Welcome back
            </Text>
          </View>
          <Text className="text-4xl font-bold text-ink">Sign in to TroupeX</Text>
          <Text className="text-base text-gray-600">{helperCopy}</Text>
        </View>

        {/* Login Card */}
        <Card className="mx-6 space-y-6 p-6 bg-white/95 rounded-3xl shadow-md">
          {/* Input */}
          <View>
            <Text className="text-sm font-semibold text-gray-600">Email</Text>
            <View
              className={`mt-3 flex-row items-center rounded-full border px-4 py-3  ${inputFocused
                ? "border-primary-400 bg-primary-50/60"
                : "border-gray-200 bg-white"
                } shadow-sm`}
            >
              <TextInput
                value={identifier}
                onChangeText={setIdentifier}
                placeholder="you@company.com"
                autoCapitalize="none"
                keyboardType="email-address"
                className="flex-1 text-base text-ink"
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                returnKeyType="done"
              />
            </View>
          </View>

          {/* Continue Button */}
          <PrimaryButton
            label={loading ? "Sending secure code..." : "Continue"}
            onPress={onLogin}
            loading={loading}
            className="rounded-full mt-6"
          />

          {/* Terms */}
          <View className="items-center mt-2">
            <Text className="text-xs text-gray-400 text-center">
              By continuing, you agree to our terms of use and privacy promise.
            </Text>
          </View>
        </Card>
      </KeyboardAvoidingView>
    </Screen>
  );
}
