import { useRef, useCallback } from "react";
import { Animated, Dimensions } from "react-native";

export const useHorizontalScroll = (
  data,
  selectedTeamIndex,
  setSelectedTeamIndex
) => {
  const { width } = Dimensions.get("screen");
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  const onScrollEnd = useCallback(
    (event) => {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(contentOffsetX / width);
      const clampedIndex = Math.max(0, Math.min(index, data.length - 1));

      if (clampedIndex !== selectedTeamIndex) {
        Animated.timing(scrollX, {
          toValue: clampedIndex * width,
          duration: 300,
          useNativeDriver: false,
        }).start();
        setSelectedTeamIndex(clampedIndex);
      }
    },
    [width, data.length, scrollX, selectedTeamIndex]
  );

  return { scrollX, flatListRef, onScrollEnd };
};
