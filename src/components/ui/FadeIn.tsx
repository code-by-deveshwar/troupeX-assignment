import { PropsWithChildren, useEffect, useRef } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";

type FadeInProps = PropsWithChildren<{
  delay?: number;
  offset?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
  className?: string;
}>;

export function FadeIn({
  children,
  delay = 0,
  offset = 18,
  duration = 320,
  style,
  className,
}: FadeInProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(offset)).current;

  useEffect(() => {
    const animation = Animated.parallel(
      [
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration,
          delay,
          useNativeDriver: true,
        }),
      ],
      { stopTogether: true },
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [delay, duration, opacity, translateY]);

  return (
    <Animated.View
      className={className}
      style={[{ opacity, transform: [{ translateY }] }, style]}
    >
      {children}
    </Animated.View>
  );
}
