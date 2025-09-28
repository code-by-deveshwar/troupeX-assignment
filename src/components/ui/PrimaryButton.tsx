import { ActivityIndicator, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PressableScale } from "./PressableScale";

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  tone?: "primary" | "secondary";
};

export function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
  className = "",
  tone = "primary",
}: PrimaryButtonProps) {
  const gradientStops =
    tone === "primary"
      ? ["#5558ff", "#3461ea"]
      : ["#be4bff", "#5558ff"];

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled || loading}
      className={`w-full ${className}`}
      style={{ opacity: disabled || loading ? 0.6 : 1 }}
    >
      <LinearGradient
        colors={gradientStops}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="w-full rounded-full"
      >
        <View className="flex-row items-center justify-center px-6 py-3 rounded-full">
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-base font-semibold text-white">
              {label}
            </Text>
          )}
        </View>
      </LinearGradient>
    </PressableScale>
  );
}
