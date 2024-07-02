import React from "react";
import { TouchableOpacity, Text } from "react-native";

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  textClassName?: string;
}

const Button = ({
  children,
  onPress,
  className,
  textClassName,
  ...rest
}: Props) => {
  return (
    <TouchableOpacity
      className={`py-4 px-4 rounded-2xl flex items-center justify-center ${className}`}
      onPress={onPress}
      {...rest}
    >
      <Text className={`text-center ${textClassName}`}>{children}</Text>
    </TouchableOpacity>
  );
};

Button.displayName = "Button";

export { Button };
