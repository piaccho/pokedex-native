import axios from "axios";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedModal } from "@/components/common/ThemedModal";
import { ThemedText } from "@/components/common/ThemedText";
import { Colors } from "@/constants/Colors";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { PokemonDetail } from "@/types/Pokemon.types";

interface PokemonSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectPokemon: (pokemonId: number) => void;
  title?: string;
  currentPokemonId?: number;
  accentColor?: string;
  pokemonDetailsOverride?: Record<number, PokemonDetail>;
}

export const PokemonSelectorModal: React.FC<PokemonSelectorModalProps> = ({
  visible,
  onClose,
  onSelectPokemon,
  title = "Select Pokémon",
  currentPokemonId,
  accentColor = Colors.light.primary,
  pokemonDetailsOverride,
}) => {
  // Get everything we need from the store
  const favorites = useFavoritesStore((state) => state.favorites);
  const pokemonDetails = useFavoritesStore((state) => state.pokemonDetails);
  const isLoading = useFavoritesStore((state) => state.isLoading);
  const fetchAllFavoriteDetails = useFavoritesStore(
    (state) => state.fetchAllFavoriteDetails,
  );

  // Fetch details when the modal becomes visible
  useEffect(() => {
    if (visible) {
      fetchAllFavoriteDetails();
    }
  }, [visible, fetchAllFavoriteDetails]);

  const handleSelectPokemon = (pokemonId: number) => {
    onSelectPokemon(pokemonId);
    onClose();
  };

  const renderListLayout = () => (
    <View style={styles.pokemonList}>
      {favorites.map((pokemonId) => {
        const pokemon = pokemonDetails[pokemonId];
        if (!pokemon) return null;

        const isSelected = currentPokemonId === pokemonId;

        return (
          <TouchableOpacity
            key={`list-${pokemon.id}`}
            style={[styles.listItem, isSelected && styles.selectedListItem]}
            onPress={() => handleSelectPokemon(pokemon.id)}
          >
            <Image
              source={{ uri: pokemon.sprites.front_default }}
              style={styles.listImage}
            />
            <ThemedText style={styles.listPokemonName}>
              {pokemon.name}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <ThemedModal visible={visible} title={title} onClose={onClose}>
      <ScrollView style={styles.scrollView}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={accentColor} />
            <ThemedText style={styles.loadingText}>
              Loading Pokémon...
            </ThemedText>
          </View>
        ) : favorites.length > 0 ? (
          renderListLayout()
        ) : (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              No favorite Pokémon yet!
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Add some from the PokéDex.
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedModal>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
    maxHeight: 400,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontFamily: "PokemonClassic",
    color: "#666",
    fontSize: 12,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontFamily: "PokemonClassic",
    fontSize: 14,
    color: Colors.light.primary,
    marginBottom: 10,
  },
  emptySubtext: {
    fontFamily: "PokemonClassic",
    fontSize: 10,
    color: "#666",
    textAlign: "center",
  },
  // List layout styles
  pokemonList: {
    width: "100%",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  selectedListItem: {
    backgroundColor: "#ffd3d3",
    borderWidth: 2,
    borderColor: "#f57575",
  },
  listImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  listPokemonName: {
    fontFamily: "PokemonClassic",
    fontSize: 12,
    color: "#000",
    textTransform: "capitalize",
  },
});
