import { PropsWithChildren } from "react";
import { Text, View, ViewProps } from "react-native";

type BadgeProps = PropsWithChildren<
  ViewProps & {
    tone?: "default" | "success" | "warning" | "muted" | "primary";
    className?: string;
  }
>;

const toneStyles: Record<NonNullable<BadgeProps["tone"]>, string> = {
  default: "bg-slate-50 text-gray-700 border-slate-100",
  success: "bg-green-50 text-success border-green-100",
  warning: "bg-orange-50 text-warning border-orange-100",
  muted: "bg-slate-25 text-gray-500 border-slate-100",
  primary: "bg-primary-50 text-primary-600 border-primary-200",
};

export function Badge({
  tone = "default",
  children,
  className = "",
  ...rest
}: BadgeProps) {
  const composedClassName = [
    "rounded-full border px-3 py-1",
    toneStyles[tone],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <View className={composedClassName} {...rest}>
      {typeof children === "string" ? (
        <Text className="text-xs font-medium uppercase tracking-wide">
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}
