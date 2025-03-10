/* eslint-disable import/no-unresolved */
import { Star } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";

import useFavorites from "@/hooks/useFavorites";

interface FavoriteButtonProps {
  pokemonId: number;
  size?: number;
  style?: object;
  position?: "topRight" | "topLeft" | "row" | "custom";
  isClickable?: boolean;
}

export const FavoriteButton = ({
  pokemonId,
  size = 40,
  style,
  position = "row",
  isClickable = true,
}: FavoriteButtonProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(pokemonId);

  const getContainerStyle = () => {
    switch (position) {
      case "topRight":
        return styles.topRight;
      case "topLeft":
        return styles.topLeft;
      case "row":
        return styles.row;
      case "custom":
        return {};
      default:
        return styles.row;
    }
  };

  const handlePress = () => {
    toggleFavorite(pokemonId);
  };

  // Render either TouchableOpacity or View based on isClickable prop
  const containerStyle = [styles.favButton, getContainerStyle(), style];

  if (!isClickable) {
    return (
      <View style={containerStyle}>
        <Star
          {...(isFav ? { fill: "#FFD700" } : {})}
          strokeWidth={1}
          size={size}
          stroke="black"
        />
      </View>
    );
  }

  return (
    <TouchableOpacity style={containerStyle} onPress={handlePress}>
      <Star
        {...(isFav ? { fill: "#FFD700" } : {})}
        strokeWidth={1}
        size={size}
        stroke="black"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  favButton: {
    padding: 10,
  },
  topRight: {
    position: "absolute",
    top: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
  },
  topLeft: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
});
