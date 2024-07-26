import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

const BouncingBall = ({ animation }) => {
  return (
    <Animated.View
      style={[
        styles.ball,
        {
          transform: [
            {
              translateY: animation,
            },
          ],
        },
      ]}
    />
  );
};

const LoadingAnimation = () => {
  // Create animated values for each ball
  const animations = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    // Function to create the bouncing animation with a longer delay
    const createAnimation = (anim, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: -30,
            duration: 500,
            delay: delay, // Delay before the start of the animation
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.delay(300), // Longer delay after the animation completes
        ])
      );
    };

    // Create an array of animations with staggered delays
    const animationsWithDelays = animations.map(
      (anim, index) => createAnimation(anim, index * 100) // Stagger each animation by 300ms
    );

    // Start all animations with looping
    animationsWithDelays.forEach((anim) => anim.start());
  }, [animations]);

  return (
    <View style={styles.container}>
      {animations.map((animation, index) => (
        <BouncingBall key={index} animation={animation} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  ball: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 5,
  },
});

export default LoadingAnimation;
