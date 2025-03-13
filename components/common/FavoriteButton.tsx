/* eslint-disable import/no-unresolved */
import { Star } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

import { useFavoritesStore } from "@/stores/useFavoritesStore";

interface FavoriteButtonProps {
  pokemonId: number;
  size?: number;
  style?: object;
  position?: "topRight" | "topLeft" | "row" | "custom";
  isClickable?: boolean;
  showAlways?: boolean;
}

export const FavoriteButton = ({
  pokemonId,
  size = 40,
  style,
  position = "row",
  isClickable = true,
  showAlways = true,
}: FavoriteButtonProps) => {
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const favorites = useFavoritesStore((state) => state.favorites);
  const isFavorite = favorites.includes(pokemonId);

  // Hide button if it's not a favorite and shouldn't always be shown
  if (!isFavorite && !showAlways) {
    return null;
  }

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

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={handlePress}
      disabled={!isClickable}
    >
      <Star
        {...(isFavorite ? { fill: "#FFD700" } : {})}
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
