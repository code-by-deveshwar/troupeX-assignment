import { forwardRef, PropsWithChildren, useRef } from "react";
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  PressableProps,
} from "react-native";
import * as Haptics from "expo-haptics";

type PressableScaleProps = PropsWithChildren<
  PressableProps & {
    className?: string;
    scaleTo?: number;
    disableHaptics?: boolean;
  }
>;

export const PressableScale = forwardRef<View, PressableScaleProps>(
  (
    {
      children,
      className,
      scaleTo = 0.96,
      disableHaptics,
      onPressIn,
      onPressOut,
      onPress,
      style,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const scale = useRef(new Animated.Value(1)).current;

    const animateTo = (value: number) => {
      Animated.spring(scale, {
        toValue: value,
        useNativeDriver: true,
        speed: 20,
        bounciness: 6,
      }).start();
    };

    const handlePressIn = (event: GestureResponderEvent) => {
      if (disabled) return;
      animateTo(scaleTo);
      onPressIn?.(event);
    };

    const handlePressOut = (event: GestureResponderEvent) => {
      animateTo(1);
      onPressOut?.(event);
    };

    const handlePress = async (event: GestureResponderEvent) => {
      if (disabled) return;
      if (!disableHaptics) {
        try {
          await Haptics.selectionAsync();
        } catch {
          // noop – haptics may not be available on web / simulators
        }
      }
      onPress?.(event);
    };

    return (
      <Pressable
        ref={ref}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        {...rest}
      >
        <Animated.View
          className={className}
          style={[{ transform: [{ scale }] }, style]}
        >
          {children}
        </Animated.View>
      </Pressable>
    );
  },
);

PressableScale.displayName = "PressableScale";
