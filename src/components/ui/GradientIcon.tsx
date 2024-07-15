import React from "react";
import { Svg, Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import MaskedView from "@react-native-masked-view/masked-view";

const GradientIcon = ({ IconComponent, isActive }) => {
  const iconSize = 24;
  const strokeWidth = 1.5; // Adjust the stroke width here

  return isActive ? (
    <MaskedView
      maskElement={
        <IconComponent
          width={iconSize}
          height={iconSize}
          strokeWidth={strokeWidth}
          stroke="white" // Set stroke color for the mask
          fill="none" // Ensure the fill is set to none
        />
      }
    >
      <Svg height={iconSize} width={iconSize}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#4CC3A4" />
            <Stop offset="100%" stopColor="#8CDF9B" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
      </Svg>
    </MaskedView>
  ) : (
    <IconComponent
      width={iconSize}
      height={iconSize}
      strokeWidth={strokeWidth}
      stroke="white" // Set stroke color for the non-active icon
      fill="none" // Ensure the fill is set to none
    />
  );
};

export default GradientIcon;
