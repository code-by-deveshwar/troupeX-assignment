import { PropsWithChildren } from "react";
import { View, ViewProps } from "react-native";

type CardProps = PropsWithChildren<ViewProps & { className?: string }>;

export function Card({ children, className = "", style, ...rest }: CardProps) {
  const composedClassName = [
    "bg-white/95 rounded-3xl border border-white/60 shadow-soft",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <View
      className={composedClassName}
      style={[{ elevation: 5, backgroundColor: "rgba(255,255,255,0.95)" }, style]}
      {...rest}
    >
      {children}
    </View>
  );
}
