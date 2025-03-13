import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { PokemonDetail } from "@/types/Pokemon.types";

const FAVORITES_STORAGE_KEY = "pokemon-favorites";

interface FavoritesState {
  favorites: number[];
  pokemonDetails: Record<number, PokemonDetail>;

  isLoading: boolean;
  error: string | null;
  toggleFavorite: (pokemonId: number) => Promise<void>;
  isFavorite: (pokemonId: number) => boolean;
  clearAllFavorites: () => void;
  fetchPokemonDetail: (pokemonId: number) => Promise<PokemonDetail | null>;
  fetchAllFavoriteDetails: () => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      pokemonDetails: {},

      isLoading: false,
      error: null,

      toggleFavorite: async (pokemonId: number) => {
        try {
          const { favorites } = get();
          const isCurrentlyFavorite = favorites.includes(pokemonId);

          if (isCurrentlyFavorite) {
            // If it's a favorite, remove it
            set({ favorites: favorites.filter((id) => id !== pokemonId) });
          } else {
            // If it's not a favorite, add it
            set({ favorites: [...favorites, pokemonId] });
          }

          console.log(
            `Toggled favorite for pokemon ${pokemonId} from ${isCurrentlyFavorite} to ${!isCurrentlyFavorite}`,
          );
        } catch (err) {
          console.error("Error toggling favorite:", err);
          set({ error: "Failed to toggle favorite" });
        }
      },

      isFavorite: (pokemonId: number) => {
        return get().favorites.includes(pokemonId);
      },

      clearAllFavorites: () => {
        try {
          set({ favorites: [] });
        } catch (err) {
          console.error("Error clearing all favorites:", err);
          set({ error: "Failed to clear all favorites" });
        }
      },

      // New function to fetch a single Pokemon's details
      fetchPokemonDetail: async (pokemonId: number) => {
        const { pokemonDetails } = get();

        // Return cached data if available
        if (pokemonDetails[pokemonId]) {
          return pokemonDetails[pokemonId];
        }

        try {
          set({ isLoading: true, error: null });
          const response = await axios.get<PokemonDetail>(
            `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
          );

          // Update the store with the new Pokemon detail
          set((state) => ({
            pokemonDetails: {
              ...state.pokemonDetails,
              [pokemonId]: response.data,
            },
          }));

          return response.data;
        } catch (err) {
          console.error(
            `Error fetching details for Pokemon ${pokemonId}:`,
            err,
          );
          set({ error: `Failed to fetch Pokemon #${pokemonId}` });
          return null;
        } finally {
          set({ isLoading: false });
        }
      },

      // New function to fetch all favorite Pokemon details
      fetchAllFavoriteDetails: async () => {
        const { favorites, pokemonDetails } = get();

        // Find which Pokemon we need to fetch
        const idsToFetch = favorites.filter((id) => !pokemonDetails[id]);

        if (idsToFetch.length === 0) {
          return; // All favorites already cached
        }

        try {
          set({ isLoading: true, error: null });

          const promises = idsToFetch.map((id) =>
            axios.get<PokemonDetail>(`https://pokeapi.co/api/v2/pokemon/${id}`),
          );

          const responses = await Promise.all(promises);
          const newDetails: Record<number, PokemonDetail> = {};

          responses.forEach((response) => {
            const pokemon = response.data;
            newDetails[pokemon.id] = pokemon;
          });

          // Update store with all new Pokemon details
          set((state) => ({
            pokemonDetails: {
              ...state.pokemonDetails,
              ...newDetails,
            },
          }));
        } catch (err) {
          console.error("Error fetching multiple Pokemon details:", err);
          set({ error: "Failed to load some Pokemon details" });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: FAVORITES_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        favorites: state.favorites,
        // Don't persist pokemon details to storage
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.isLoading = false;
      },
    },
  ),
);
