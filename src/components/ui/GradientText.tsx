import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import React from "react";

export const GradientText = (props: any) => {
  return (
    <MaskedView
      maskElement={
        <Text
          style={[props.style, { backgroundColor: "transparent" }]}
          className="text-sm"
        >
          {props.text}
        </Text>
      }
    >
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={["#4CC3A4", "#8CDF9B"]}
      >
        <Text style={[props.style, { opacity: 0 }]} className="text-sm">
          {props.text}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
};
