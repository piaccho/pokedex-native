/* eslint-disable import/no-unresolved */
import { useFavoritesStore } from "@/stores/useFavoritesStore";

/**
 * Custom hook for managing Pokemon favorites
 *
 * @returns Object containing favorites state and functions to manage favorites
 */
const useFavorites = () => {
  const favorites = useFavoritesStore((state) => state.favorites);
  const isLoading = useFavoritesStore((state) => state.isLoading);
  const error = useFavoritesStore((state) => state.error);
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = useFavoritesStore((state) => state.isFavorite);

  return {
    favorites,
    isLoading,
    error,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
};

export default useFavorites;
