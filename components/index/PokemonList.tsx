/* eslint-disable import/no-unresolved */
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  View,
  StyleSheet,
} from "react-native";

import PokemonItem from "../common/PokemonItem";

import { ThemedText } from "@/components/common/ThemedText";
import { PokemonConstants } from "@/constants/PokemonConstants";
import { PokemonDetail, PokemonResult } from "@/types/Pokemon.types";

interface PokemonListProps {
  pokemons: PokemonResult[];
  filteredPokemons: PokemonResult[];
  refreshing: boolean;
  loadingMore: boolean;
  selectedTypes: string[];
  onRefresh: () => void;
  onLoadMore: () => void;
  onPokemonPress: (pokemon: PokemonDetail) => void;
  onTypesLoaded: (url: string, types: string[]) => void;
}

export const PokemonList: React.FC<PokemonListProps> = ({
  pokemons,
  filteredPokemons,
  refreshing,
  loadingMore,
  selectedTypes,
  onRefresh,
  onLoadMore,
  onPokemonPress,
  onTypesLoaded,
}) => {
  const renderItem: ListRenderItem<PokemonResult> = useCallback(
    ({ item }) => (
      <PokemonItem
        pokemonUrl={item.url}
        openPokemonSheet={onPokemonPress}
        selectedTypes={selectedTypes}
        showFavButtonAlways={false}
        onTypesLoaded={onTypesLoaded}
      />
    ),
    [selectedTypes, onPokemonPress, onTypesLoaded],
  );

  const keyExtractor = useCallback((item: PokemonResult) => item.url, []);

  const renderFooter = useCallback(
    () =>
      loadingMore && pokemons.length >= 8 ? (
        <ActivityIndicator animating size="large" />
      ) : null,
    [loadingMore, pokemons.length],
  );

  if (pokemons.length === 0 && !refreshing) {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText>No Pokémon found. Please try again later.</ThemedText>
      </View>
    );
  }

  return (
    <FlashList
      data={filteredPokemons}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      numColumns={PokemonConstants.NUM_COLUMNS}
      removeClippedSubviews
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListFooterComponent={renderFooter}
      onEndReached={onLoadMore}
      onEndReachedThreshold={PokemonConstants.END_REACHED_THRESHOLD}
    />
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
