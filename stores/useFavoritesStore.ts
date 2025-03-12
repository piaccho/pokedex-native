import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const FAVORITES_STORAGE_KEY = "pokemon-favorites";

interface FavoritesState {
  favorites: number[];
  isLoading: boolean;
  error: string | null;
  toggleFavorite: (pokemonId: number) => Promise<void>;
  isFavorite: (pokemonId: number) => boolean;
  clearAllFavorites: () => void; // Add this new method
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      isLoading: false,
      error: null,

      toggleFavorite: async (pokemonId: number) => {
        try {
          const { favorites } = get();
          const isCurrentlyFavorite = favorites.includes(pokemonId);

          console.log(
            `Toggling favorite for pokemon ${pokemonId}, current status: ${isCurrentlyFavorite}`,
          );

          if (isCurrentlyFavorite) {
            // If it's a favorite, remove it
            set({ favorites: favorites.filter((id) => id !== pokemonId) });
          } else {
            // If it's not a favorite, add it
            set({ favorites: [...favorites, pokemonId] });
          }
        } catch (err) {
          console.error("Error toggling favorite:", err);
          set({ error: "Failed to toggle favorite" });
        }
      },

      isFavorite: (pokemonId: number) => {
        return get().favorites.includes(pokemonId);
      },

      clearAllFavorites: () => {
        console.log("Clearing all favorites");
        set({ favorites: [] });
      },
    }),
    {
      name: FAVORITES_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.isLoading = false;
      },
    },
  ),
);
