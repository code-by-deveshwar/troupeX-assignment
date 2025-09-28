import { View } from "react-native";

type ProgressBarProps = {
  value: number;
  className?: string;
};

export function ProgressBar({ value, className = "" }: ProgressBarProps) {
  const normalized = Math.max(0, Math.min(1, value));

  return (
    <View className={["h-2 w-full overflow-hidden rounded-full bg-slate-100", className].join(" ")}
    >
      <View
        className="h-full rounded-full bg-primary-500"
        style={{ width: `${normalized * 100}%` }}
      />
    </View>
  );
}
