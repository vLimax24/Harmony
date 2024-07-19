import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import React from "react";
import { cn } from "@/lib/utils";

interface Props {
  text: string;
  style?: any;
  className?: string;
}

export const GradientText = (props: Props) => {
  return (
    <MaskedView
      className="items-center justify-center flex-row"
      maskElement={
        <Text
          style={[props.style, { backgroundColor: "transparent" }]}
          className={cn(props?.className)}
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
        <Text
          style={[props.style, { opacity: 0 }]}
          className={cn(props?.className)}
        >
          {props.text}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
};
