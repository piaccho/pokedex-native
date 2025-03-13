import BottomSheet from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import DebugButton from "@/components/common/DebugButton";
import { ThemedSafeAreaView } from "@/components/common/ThemedSafeAreaView";
import PokemonBottomSheet from "@/components/index/PokemonBottomSheet";
import { PokemonList } from "@/components/index/PokemonList";
import { PokemonSortFilterSystem } from "@/components/index/PokemonSortFilterSystem";
import { PokemonConstants } from "@/constants/PokemonConstants";
import usePokemonData from "@/hooks/usePokemonData";
import { usePokemonFilters } from "@/hooks/usePokemonFilters";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { PokemonDetail } from "@/types/Pokemon.types";

export default function PokedexScreen() {
  const {
    pokemons,
    refreshing,
    loadingMore,
    handleRefresh,
    loadMore,
    initialLoader,
    errorMessage,
  } = usePokemonData();

  const {
    selectedTypes,
    sortDirection,
    filteredAndSortedPokemons,
    handleTypeSelect,
    handleSortDirectionChange,
    handleApplyFilters,
    handlePokemonTypesLoaded,
  } = usePokemonFilters({ pokemons });

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetail | null>(
    null,
  );

  // Debug data access
  const favorites = useFavoritesStore((state) => state.favorites);

  useEffect(() => {
    if (selectedPokemon) {
      const timer = setTimeout(() => {
        bottomSheetRef.current?.expand();
      }, PokemonConstants.BOTTOM_SHEET_DELAY);
      return () => clearTimeout(timer);
    }
  }, [selectedPokemon]);

  const handleDebugPress = useCallback(() => {
    console.log(`Favorites: ${JSON.stringify(favorites)}`);
    console.log(`Selected types: ${JSON.stringify(selectedTypes)}`);
    console.log(`Sort direction: ${sortDirection}`);
    console.log(`Selected Pokemon: ${JSON.stringify(selectedPokemon?.id)}`);
  }, [favorites, selectedTypes, sortDirection, selectedPokemon]);

  const handlePokemonPress = useCallback((pokemon: PokemonDetail) => {
    setSelectedPokemon(pokemon);
  }, []);
  const handleBottomSheetClose = useCallback(() => {
    setSelectedPokemon(null);
  }, []);

  if (initialLoader) {
    return (
      <SafeAreaProvider>
        <ThemedSafeAreaView style={styles.container}>
          <ActivityIndicator size="large" />
        </ThemedSafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemedSafeAreaView style={styles.container}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          {process.env.NODE_ENV !== "production" && (
            <DebugButton action={handleDebugPress} />
          )}

          <PokemonSortFilterSystem
            selectedTypes={selectedTypes}
            sortDirection={sortDirection}
            errorMessage={errorMessage}
            onTypeSelect={handleTypeSelect}
            onSortDirectionChange={handleSortDirectionChange}
            onApplyFilters={handleApplyFilters}
          />

          <PokemonList
            pokemons={pokemons}
            filteredPokemons={filteredAndSortedPokemons}
            refreshing={refreshing}
            loadingMore={loadingMore}
            selectedTypes={selectedTypes}
            onRefresh={handleRefresh}
            onLoadMore={loadMore}
            onPokemonPress={handlePokemonPress}
            onTypesLoaded={handlePokemonTypesLoaded}
          />

          {selectedPokemon && (
            <PokemonBottomSheet
              sheetRef={bottomSheetRef}
              selectedPokemon={selectedPokemon}
              onClose={handleBottomSheetClose}
            />
          )}
        </GestureHandlerRootView>
      </ThemedSafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
