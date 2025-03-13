import { Image } from "expo-image";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { PokemonDetail } from "@/types/Pokemon.types";

import { ThemedModal } from "../common/ThemedModal";
import { ThemedText } from "../common/ThemedText";

interface QuickSelectModalProps {
  visible: boolean;
  onClose: () => void;
  favorites: number[];
  pokemonDetails: Record<number, PokemonDetail>;
  isLoading: boolean;
  currentIndex: number;
  onSelectPokemon: (index: number) => void;
  accentColor: string;
}

export const QuickSelectModal = ({
  visible,
  onClose,
  favorites,
  pokemonDetails,
  isLoading,
  currentIndex,
  onSelectPokemon,
  accentColor,
}: QuickSelectModalProps) => {
  return (
    <ThemedModal visible={visible} title="Select Pokemon" onClose={onClose}>
      <ScrollView style={styles.quickSelectList}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={accentColor} />
            <ThemedText style={styles.loadingText}>
              Loading Pokémon...
            </ThemedText>
          </View>
        ) : favorites.length > 0 ? (
          <View style={styles.pokemonItemsContainer}>
            {favorites.map((pokemonId, index) => {
              const pokemon = pokemonDetails[pokemonId];
              if (!pokemon) return null;

              return (
                <TouchableOpacity
                  key={`quick-${pokemon.id}`}
                  style={[
                    styles.pokemonItem,
                    currentIndex === index && styles.selectedPokemonItem,
                  ]}
                  onPress={() => onSelectPokemon(index)}
                >
                  <Image
                    source={{ uri: pokemon.sprites.front_default }}
                    style={styles.pokemonImage}
                  />
                  <ThemedText style={styles.pokemonText}>
                    {pokemon.name}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <ThemedText style={styles.emptyText}>No favorites yet</ThemedText>
        )}
      </ScrollView>
    </ThemedModal>
  );
};

const styles = StyleSheet.create({
  quickSelectList: {
    width: "100%",
    maxHeight: 400,
  },
  pokemonItemsContainer: {
    width: "100%",
  },
  pokemonItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  selectedPokemonItem: {
    backgroundColor: "#ffd3d3",
    borderWidth: 2,
    borderColor: "#f57575",
  },
  pokemonImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  pokemonText: {
    fontFamily: "PokemonClassic",
    fontSize: 12,
    color: "#000",
    textTransform: "capitalize",
  },
  emptyText: {
    textAlign: "center",
    padding: 20,
    fontFamily: "PokemonClassic",
    color: "#666",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontFamily: "PokemonClassic",
    color: "#666",
  },
});
