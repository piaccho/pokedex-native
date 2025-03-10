/* eslint-disable react/display-name */
/* eslint-disable import/no-unresolved */
import axios from "axios";
import React, { useState, useEffect, memo } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import { FavoriteButton } from "@/components/FavoriteButton";
import { ThemedText } from "@/components/ThemedText";
import PokemonImage from "@/components/index/PokemonImage";
import { TypesContainer } from "@/components/index/TypesContainer";
import useFavorites from "@/hooks/useFavorites";
import { PokemonDetail } from "@/types/Pokemon.types";
import { matchesSelectedTypes, formatPokemonName } from "@/utils/pokemonUtils";

// Constants
const ITEM_HEIGHT = 150;

interface PokemonItemProps {
  pokemonUrl: string;
  openPokemonSheet: (pokemon: PokemonDetail) => void;
  selectedTypes: string[];
}

const PokemonItem = memo(
  ({ pokemonUrl, openPokemonSheet, selectedTypes }: PokemonItemProps) => {
    const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
    const [error, setError] = useState<boolean>(false);
    const { isFavorite } = useFavorites();

    useEffect(() => {
      let isMounted = true;

      const fetchPokemonDetails = async () => {
        try {
          const response = await axios.get<PokemonDetail>(pokemonUrl);
          if (isMounted) {
            setPokemon(response.data);
          }
        } catch (err) {
          if (isMounted) {
            setError(true);
            console.error("Error fetching pokemon:", err);
          }
        }
      };

      fetchPokemonDetails();
      return () => {
        isMounted = false;
      };
    }, [pokemonUrl]);

    if (error) {
      return (
        <View style={styles.item}>
          <ThemedText>Error loading Pokemon</ThemedText>
        </View>
      );
    }

    if (!pokemon) {
      return (
        <View style={styles.item}>
          <ActivityIndicator size="small" />
        </View>
      );
    }

    // Filter by type if any types are selected
    const pokemonTypes = pokemon.types.map((t) => t.type.name);
    if (
      selectedTypes.length > 0 &&
      !matchesSelectedTypes(pokemonTypes, selectedTypes)
    ) {
      return null;
    }

    const showFavoriteButton = isFavorite(pokemon.id);
    const displayName = formatPokemonName(pokemon.name);

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => openPokemonSheet(pokemon)}
      >
        <TypesContainer types={pokemon.types} size={20} position="topLeft" />
        <PokemonImage uri={pokemon.sprites.front_default} />
        {showFavoriteButton && (
          <FavoriteButton
            pokemonId={pokemon.id}
            position="topRight"
            size={25}
            isClickable={false}
          />
        )}
        <ThemedText style={styles.title}>{displayName}</ThemedText>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  item: {
    flex: 1,
    height: ITEM_HEIGHT,
    borderRadius: 10,
    margin: 5,
    padding: 10,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: { width: 3, height: 3 },
  },
  title: {
    fontSize: 12,
    fontFamily: "PokemonClassic",
    color: "#000",
    textAlign: "center",
  },
});

export default PokemonItem;
