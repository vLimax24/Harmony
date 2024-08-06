import { useRef, useEffect, useCallback } from "react";
import { Animated } from "react-native";

// Custom Hook for Exponential Smoothing
export const useExponentialSmoothing = (
  initialValue = 0,
  smoothingFactor = 0.1
) => {
  const animatedValue = useRef(new Animated.Value(initialValue)).current;
  const lastScrollX = useRef(initialValue);

  const smoothScroll = useCallback(
    (scrollX) => {
      const dt = 1; // For simplicity, you may need to adjust based on time intervals
      const speed = smoothingFactor;
      const target = scrollX;
      const currentValue = lastScrollX.current;
      const newValue =
        currentValue + (target - currentValue) * (1 - Math.exp(-dt * speed));

      lastScrollX.current = newValue;

      Animated.spring(animatedValue, {
        toValue: newValue,
        useNativeDriver: false,
      }).start();
    },
    [animatedValue, smoothingFactor]
  );

  return { animatedValue, smoothScroll };
};
