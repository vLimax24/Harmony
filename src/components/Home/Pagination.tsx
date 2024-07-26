import React from "react";
import { StyleSheet, Animated, View, Dimensions } from "react-native";

const { width } = Dimensions.get("screen");

export const Pagination = ({ data, scrollX, index }) => {
  return (
    <View
      style={styles.container}
      className="bg-backgroundShade p-4 rounded-2xl"
    >
      {data.map((_, idx) => {
        const inputRange = [(idx - 1) * width, idx * width, (idx + 1) * width];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [12, 30, 12],
          extrapolate: "clamp",
        });

        const backgroundColor = scrollX.interpolate({
          inputRange,
          outputRange: ["#ccc", "#fff", "#ccc"],
          extrapolate: "clamp",
        });

        const opacity = idx === index ? 1 : 0.5;

        return (
          <Animated.View
            key={idx.toString()}
            style={[
              styles.dot,
              {
                width: dotWidth,
                backgroundColor,
                opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 35,
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    height: 12,
    borderRadius: 6,
    marginHorizontal: 3,
    backgroundColor: "#ccc",
  },
});
