/* eslint-disable import/no-unresolved */
import { Image, ImageStyle } from "expo-image";
import React from "react";
import { View, StyleSheet } from "react-native";

import { TYPE_IMAGES } from "@/assets/images/pokemon-types/typeImages";

interface TypesContainerProps {
  types: { type: { name: string } }[];
  size?: number;
  position?: "topRight" | "topLeft" | "row" | "custom";
  style?: object;
}

export const TypesContainer = ({
  types,
  size = 20,
  position = "topRight",
  style: customStyle = {},
}: TypesContainerProps) => {
  const getContainerStyle = () => {
    switch (position) {
      case "topRight":
        return styles.topRightContainer;
      case "topLeft":
        return styles.topLeftContainer;
      case "row":
        return styles.rowContainer;
      case "custom":
        return {};
      default:
        return styles.topRightContainer;
    }
  };

  return (
    <View style={[getContainerStyle(), customStyle]}>
      {types.map((type) => (
        <Image
          key={type.type.name}
          source={TYPE_IMAGES[type.type.name as keyof typeof TYPE_IMAGES]}
          style={[styles.typeImage, { width: size, height: size }]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  topRightContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
  },
  topLeftContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 4,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  typeImage: {
    resizeMode: "contain",
  } as ImageStyle,
});
