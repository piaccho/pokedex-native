import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const FAVORITES_STORAGE_KEY = "pokemon-favorites";

interface FavoritesState {
  favorites: number[];
  isLoading: boolean;
  error: string | null;
  addFavorite: (pokemonId: number) => Promise<void>;
  removeFavorite: (pokemonId: number) => Promise<void>;
  toggleFavorite: (pokemonId: number) => Promise<void>;
  isFavorite: (pokemonId: number) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      isLoading: false,
      error: null,

      addFavorite: async (pokemonId: number) => {
        try {
          const { favorites } = get();
          if (!favorites.includes(pokemonId)) {
            set({ favorites: [...favorites, pokemonId] });
          }
        } catch (err) {
          console.error("Error adding favorite:", err);
          set({ error: "Failed to add favorite" });
        }
      },

      removeFavorite: async (pokemonId: number) => {
        try {
          const { favorites } = get();
          set({ favorites: favorites.filter((id) => id !== pokemonId) });
        } catch (err) {
          console.error("Error removing favorite:", err);
          set({ error: "Failed to remove favorite" });
        }
      },

      toggleFavorite: async (pokemonId: number) => {
        const { favorites, addFavorite, removeFavorite } = get();
        console.log("Toggling favorite for pokemon", pokemonId);

        if (favorites.includes(pokemonId)) {
          await removeFavorite(pokemonId);
        } else {
          await addFavorite(pokemonId);
        }
      },

      isFavorite: (pokemonId: number) => {
        return get().favorites.includes(pokemonId);
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
