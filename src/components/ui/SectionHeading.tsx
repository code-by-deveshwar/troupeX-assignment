import { memo } from "react";
import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PressableScale } from "./PressableScale";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export const SectionHeading = memo(function SectionHeading({
  title,
  subtitle,
  actionLabel,
  onActionPress,
}: SectionHeadingProps) {
  return (
    <View className="mb-4 flex-row items-center justify-between">
      <View className="flex-1 pr-4">
        <LinearGradient
          colors={["#5558ff", "#be4bff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="mb-2 h-[2px] w-12 rounded-full"
        />
        <Text className="text-base font-semibold text-ink">{title}</Text>
        {subtitle ? (
          <Text className="text-sm text-gray-500">{subtitle}</Text>
        ) : null}
      </View>
      {actionLabel && onActionPress ? (
        <PressableScale onPress={onActionPress} className="rounded-full">
          <View className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1">
            <Text className="text-sm font-semibold text-primary-600">
              {actionLabel}
            </Text>
          </View>
        </PressableScale>
      ) : null}
    </View>
  );
});
