import axios from "axios";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import DebugButton from "@/components/common/DebugButton";
import { PokemonCard } from "@/components/common/PokemonCard";
import { ThemedSafeAreaView } from "@/components/common/ThemedSafeAreaView";
import { ThemedText } from "@/components/common/ThemedText";
import {
  FavoritesScreenOptions,
  NavigationStrategy,
} from "@/components/favorites/FavoritesScreenOptions";
import { Colors } from "@/constants/Colors";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { PokemonDetail } from "@/types/Pokemon.types";

export default function FavoritePokemonsScreen() {
  const insets = useSafeAreaInsets();
  const favorites = useFavoritesStore((state) => state.favorites);
  const clearAllFavorites = useFavoritesStore(
    (state) => state.clearAllFavorites,
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPokemon, setCurrentPokemon] = useState<PokemonDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [navStrategy] = useState<NavigationStrategy>(
    NavigationStrategy.DOUBLE_ENDED,
  );

  // Fetch the current favorite Pokemon details
  useEffect(() => {
    const fetchPokemon = async () => {
      if (favorites.length === 0) {
        setCurrentPokemon(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const pokemonId = favorites[currentIndex];
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
        );
        setCurrentPokemon(response.data);
      } catch (error) {
        console.error("Error fetching Pokemon:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [favorites, currentIndex]);

  return (
    <SafeAreaProvider>
      <ThemedSafeAreaView style={styles.container}>
        <GestureHandlerRootView
          style={[
            styles.contentContainer,
            styles.containerShadow,
            {
              marginBottom: Platform.OS === "ios" ? insets.bottom + 30 : 70,
            },
          ]}
        >
          <DebugButton
            action={function (): void {
              clearAllFavorites();
            }}
          />
          {/* Pokemon Details */}
          <View
            style={[
              styles.itemContainer,
              styles.pokemonDetailsContainer,
              styles.containerShadow,
            ]}
          >
            {loading ? (
              <ThemedText style={styles.text}>Loading...</ThemedText>
            ) : favorites.length > 0 && currentPokemon ? (
              <PokemonCard
                pokemon={currentPokemon}
                layout="favorite"
                showDetails
                isClickable={false}
                key={`favorite-${currentPokemon.id}`}
              />
            ) : (
              <View style={styles.infoTextContainer}>
                <ThemedText style={styles.text}>
                  No favorite Pokémon yet!
                </ThemedText>
                <ThemedText style={styles.text}>
                  Add some from the PokéDex.
                </ThemedText>
              </View>
            )}
          </View>

          {/* Options */}
          <View style={[styles.itemContainer, styles.navigationContainer]}>
            <FavoritesScreenOptions
              currentIndex={currentIndex}
              onIndexChange={setCurrentIndex}
              strategy={navStrategy}
              totalItems={favorites.length}
            />
          </View>
        </GestureHandlerRootView>
      </ThemedSafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },

  containerShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: { width: 3, height: 3 },
  },
  text: {
    padding: 10,
    fontSize: 20,
    color: "#fff",
    fontFamily: "PokemonClassic",
    textAlign: "center",
  },
  itemContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  infoTextContainer: {
    padding: 30,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  pokemonDetailsContainer: {
    flex: 5,
    backgroundColor: Colors.light.primary,
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  navigationContainer: {
    flex: 1,
    marginBottom: 10,
  },
});
