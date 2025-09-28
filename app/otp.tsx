import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "../src/store/authStore";
import { Screen } from "../src/components/layout/Screen";
import { Card } from "../src/components/ui/Card";
import { PrimaryButton } from "../src/components/ui/PrimaryButton";
import { PressableScale } from "../src/components/ui/PressableScale";
import { FadeIn } from "../src/components/ui/FadeIn";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;

export default function OTPScreen() {
  const { verify, login, identifier } = useAuthStore();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const router = useRouter();

  useEffect(() => {
    if (!identifier) {
      router.replace("/");
    }
  }, [identifier, router]);

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const formattedIdentifier = useMemo(() => {
    if (!identifier) return "";
    if (identifier.includes("@")) return identifier.toLowerCase();
    return `••••${identifier.slice(-4)}`;
  }, [identifier]);

  const onVerify = async () => {
    if (otp.length !== OTP_LENGTH) {
      Alert.alert("Incomplete code", "Enter all six digits to continue.");
      return;
    }

    try {
      setLoading(true);
      await verify(otp);
      router.replace("/feed");
    } catch (e: any) {
      Alert.alert(
        "Something went wrong",
        e?.response?.data?.message || e?.message || "Please double-check the code and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      await login();
      setCooldown(RESEND_COOLDOWN);
    } catch (e: any) {
      Alert.alert(
        "Unable to resend",
        e?.response?.data?.message || e?.message || "Please wait a moment and try again.",
      );
    }
  };

  const maskedDigits = [...Array(OTP_LENGTH)].map((_, index) => otp[index] ?? "");

  return (
    <Screen edges={["top", "bottom", "left", "right"]} className="justify-center bg-transparent">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <LinearGradient
          colors={["#eff4ff", "#f0f5ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-1 justify-center"
        >
          <View className="mb-10 gap-3 px-4">
            <View className="self-start rounded-full bg-white/70 px-3 py-1">
              <Text className="text-xs font-semibold text-primary-700 uppercase tracking-[0.18em]">
                Secure sign in
              </Text>
            </View>
            <Text className="text-3xl font-semibold text-ink">Check your inbox</Text>
            <Text className="text-base text-gray-600">
              We sent a one-time passcode to {formattedIdentifier || "your account"}.
            </Text>
          </View>

          <Card className="mx-4 space-y-6 p-6 bg-white/95">
            <FadeIn duration={400} className="items-center gap-6">
              <View className="w-full items-center gap-4">
                <Text className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Secure code
                </Text>
                <View className="relative">
                  <View className="flex-row items-center justify-center gap-3">
                    {maskedDigits.map((digit, index) => (
                      <View
                        key={index}
                        className={`h-16 w-12 items-center justify-center rounded-2xl border text-2xl font-semibold ${
                          digit
                            ? "border-primary-400 bg-primary-50"
                            : "border-slate-100 bg-slate-25"
                        }`}
                      >
                        <Text className="text-2xl font-semibold text-ink">{digit}</Text>
                      </View>
                    ))}
                  </View>
                  <TextInput
                    value={otp}
                    onChangeText={(value) =>
                      setOtp(value.replace(/\D/g, "").slice(0, OTP_LENGTH))
                    }
                    keyboardType="number-pad"
                    maxLength={OTP_LENGTH}
                    autoFocus
                    className="absolute inset-0 h-16 opacity-0"
                  />
                </View>
                <Text className="text-xs text-gray-500">
                  Codes expire quickly for security reasons.
                </Text>
              </View>

              <PrimaryButton
                label={loading ? "Verifying" : "Verify & Continue"}
                onPress={onVerify}
                loading={loading}
              />

              <View className="items-center gap-3">
                <Text className="text-xs text-gray-500">
                  Didn’t receive it?
                </Text>
                <PressableScale onPress={handleResend} disabled={cooldown > 0}>
                  <View
                    className={`rounded-full border px-4 py-2 ${
                      cooldown === 0
                        ? "border-primary-200 bg-primary-50"
                        : "border-slate-100 bg-slate-25"
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        cooldown === 0 ? "text-primary-600" : "text-gray-400"
                      }`}
                    >
                      {cooldown === 0 ? "Resend code" : `Try again in ${cooldown}s`}
                    </Text>
                  </View>
                </PressableScale>
              </View>
            </FadeIn>

            <PressableScale
              onPress={() => router.replace("/")}
              className="items-center"
              disableHaptics
            >
              <Text className="text-xs font-semibold text-gray-500">
                Use a different account
              </Text>
            </PressableScale>
          </Card>
        </LinearGradient>
      </KeyboardAvoidingView>
    </Screen>
  );
}
