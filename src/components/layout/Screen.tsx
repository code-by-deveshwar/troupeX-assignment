import { PropsWithChildren } from "react";
import { ViewProps } from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";

type ScreenProps = PropsWithChildren<
  ViewProps & {
    className?: string;
    padded?: boolean;
    edges?: Edge[];
  }
>;

export function Screen({
  children,
  className = "",
  padded = true,
  edges = ["top", "left", "right"],
  style,
  ...rest
}: ScreenProps) {
  const composedClassName = [
    "flex-1 bg-surfaceMuted",
    padded ? "px-4" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <SafeAreaView
      className={composedClassName}
      style={style}
      edges={edges}
      {...rest}
    >
      {children}
    </SafeAreaView>
  );
}
