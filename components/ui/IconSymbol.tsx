// This file is a fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight } from "expo-symbols";
import React from "react";
import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  sort: "sort",
  "filter-list": "filter-list",
  ar_on_you: "camera",
  star: "star",
  ladybug: "bug-report",
} as const;

export type IconSymbolName = keyof typeof MAPPING | string;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  // Check if name is in mapping, otherwise use it directly
  const iconName =
    name in MAPPING ? MAPPING[name as keyof typeof MAPPING] : name;

  return (
    <MaterialIcons
      color={color}
      size={size}
      name={iconName as any}
      style={style}
    />
  );
}
