/* eslint-disable react/display-name */
/* eslint-disable import/no-unresolved */
import axios from "axios";
import React, { useState, useEffect, memo } from "react";
import { View, ActivityIndicator } from "react-native";

import { ThemedText } from "@/components/common/ThemedText";
import { PokemonDetail } from "@/types/Pokemon.types";

import { PokemonCard } from "@/components/common/PokemonCard";

interface PokemonItemProps {
  pokemonUrl: string;
  openPokemonSheet: (pokemon: PokemonDetail) => void;
  selectedTypes: string[];
  isClickable?: boolean;
  showFavButtonAlways?: boolean;
  onTypesLoaded?: (url: string, types: string[]) => void;
}

const PokemonItem = memo(
  ({
    pokemonUrl,
    openPokemonSheet,
    selectedTypes,
    isClickable = true,
    showFavButtonAlways = true,
    onTypesLoaded,
  }: PokemonItemProps) => {
    const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      let isMounted = true;

      const fetchPokemonDetails = async () => {
        try {
          setLoading(true);
          const response = await axios.get<PokemonDetail>(pokemonUrl);
          if (isMounted) {
            setPokemon(response.data);

            // Report loaded types to parent for filtering
            if (onTypesLoaded) {
              const types = response.data.types.map((t) => t.type.name);
              onTypesLoaded(pokemonUrl, types);
            }
          }
        } catch (err) {
          if (isMounted) {
            setError(true);
            console.error("Error fetching pokemon:", err);
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

      fetchPokemonDetails();
      return () => {
        isMounted = false;
      };
    }, [pokemonUrl, onTypesLoaded]);

    if (error) {
      return (
        <View
          style={{
            flex: 1,
            height: 150,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ThemedText>Error loading Pokemon</ThemedText>
        </View>
      );
    }

    if (loading || !pokemon) {
      return (
        <View
          style={{
            flex: 1,
            height: 150,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="small" />
        </View>
      );
    }

    return (
      <PokemonCard
        pokemon={pokemon}
        layout="grid"
        showDetails={false}
        isClickable={isClickable}
        isFavButtonClickable={false}
        showFavButtonAlways={showFavButtonAlways}
        onPress={openPokemonSheet}
      />
    );
  },
);

export default PokemonItem;
