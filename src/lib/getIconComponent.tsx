import {
  WashingMachine,
  Dog,
  Cat,
  Utensils,
  Beef,
  Wrench,
  Hammer,
  Drill,
  Paintbrush,
  CookingPot,
  Stamp,
  Bone,
} from "lucide-react-native";

export const getIconComponent = (iconName, size) => {
  const iconProps = { size, color: "#E9E8E8" };
  const icons = {
    WashingMachine: <WashingMachine {...iconProps} />,
    Dog: <Dog {...iconProps} />,
    Cat: <Cat {...iconProps} />,
    Utensils: <Utensils {...iconProps} />,
    Beef: <Beef {...iconProps} />,
    Wrench: <Wrench {...iconProps} />,
    Hammer: <Hammer {...iconProps} />,
    Drill: <Drill {...iconProps} />,
    Paintbrush: <Paintbrush {...iconProps} />,
    CookingPot: <CookingPot {...iconProps} />,
    Stamp: <Stamp {...iconProps} />,
    Bone: <Bone {...iconProps} />,
  };

  return icons[iconName] || null;
};

export const iconNames = [
  "WashingMachine",
  "Dog",
  "Cat",
  "Utensils",
  "Beef",
  "Wrench",
  "Hammer",
  "Drill",
  "Paintbrush",
  "CookingPot",
  "Stamp",
  "Bone",
];
