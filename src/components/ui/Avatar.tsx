import { memo } from "react";
import { Image, Text, View } from "react-native";

type AvatarProps = {
  uri?: string | null;
  name?: string;
  size?: number;
  className?: string;
};

export const Avatar = memo(function Avatar({
  uri,
  name = "",
  size = 48,
  className = "",
}: AvatarProps) {
  const initials = name
    .split(" ")
    .map((token) => token[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (uri) {
    return (
      <Image
        source={{ uri }}
        className={[`rounded-full`, className].join(" ")}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <View
      className={[
        "items-center justify-center rounded-full bg-primary-50 border border-primary-100",
        className,
      ].join(" ")}
      style={{ width: size, height: size }}
    >
      <Text className="text-primary-600 font-semibold">
        {initials || "?"}
      </Text>
    </View>
  );
});
