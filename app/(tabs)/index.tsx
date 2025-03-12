/* eslint-disable react/display-name */

import BottomSheet from "@gorhom/bottom-sheet";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import React, {
  useState,
  memo,
  useCallback,
  useRef,
  useMemo,
  useEffect,
} from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import DebugButton from "@/components/common/DebugButton";
import { ThemedSafeAreaView } from "@/components/common/ThemedSafeAreaView";
import { ThemedText } from "@/components/common/ThemedText";
import {
  ItemSortFilter,
  SortDirection,
} from "@/components/index/ItemSortFilter";
import PokemonBottomSheet from "@/components/index/PokemonBottomSheet";
import PokemonItem from "@/components/index/PokemonItem";
import { IconSymbol } from "@/components/ui/IconSymbol";
import usePokemonData from "@/hooks/usePokemonData";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { PokemonDetail, PokemonResult } from "@/types/Pokemon.types";

// Constants
const NUM_COLUMNS = 2;

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
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetail | null>(
    null,
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SortDirection.NONE,
  );
  // TODO: Remove it later
  const favorites = useFavoritesStore((state) => state.favorites);

  useEffect(() => {
    if (errorMessage) {
    }
  }, [errorMessage]);

  const handleTypeSelect = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleSortDirectionChange = (direction: SortDirection) => {
    setSortDirection(direction);
  };

  // TODO: Fix this
  const filteredAndSortedPokemons = useMemo(() => {
    // Start with all pokemons
    let result = [...pokemons];

    // Sort if needed
    if (sortDirection !== SortDirection.NONE) {
      result = [...result].sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        if (sortDirection === SortDirection.ASC) {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      });
    }

    return result;
  }, [pokemons, sortDirection]);

  const handlePokemonPress = (pokemon: PokemonDetail) => {
    setSelectedPokemon(pokemon);
  };

  // TODO: Remove it later
  const handleDebugPress = () => {
    console.log("Pokemon data: ", JSON.stringify(pokemons, null, 2));
    console.log();
    console.log(pokemons);
    console.log(`Favorites: ${JSON.stringify(favorites)}`);
    console.log(`Selected types: ${JSON.stringify(selectedTypes)}`);
    console.log(`Sort direction: ${sortDirection}`);
    console.log(`Selected Pokemon: ${JSON.stringify(selectedPokemon?.id)}`);
  };

  const renderItem: ListRenderItem<PokemonResult> = useCallback(
    ({ item }) => {
      // If there are selected types, filtering will be done inside the PokemonItem component
      // after it fetches the Pokemon details
      return (
        <PokemonItem
          pokemonUrl={item.url}
          openPokemonSheet={handlePokemonPress}
          selectedTypes={selectedTypes}
          showFavButtonAlways={false}
        />
      );
    },
    [selectedTypes],
  );

  const keyExtractor = useCallback((item: PokemonResult) => item.url, []);

  const renderFooter = useCallback(
    () =>
      loadingMore && pokemons.length >= 8 ? (
        <ActivityIndicator animating size="large" />
      ) : null,
    [loadingMore, pokemons.length],
  );

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
        <GestureHandlerRootView>
          <DebugButton action={handleDebugPress} />
          {/* Sort/Filter component */}
          <ItemSortFilter
            selectedTypes={selectedTypes}
            onTypeSelect={handleTypeSelect}
            sortDirection={sortDirection}
            onSortDirectionChange={handleSortDirectionChange}
          />
          {/* Snackbar - TODO: use some pckg  */}
          {errorMessage && (
            <View style={styles.errorMessageContainer}>
              <ThemedText style={styles.errorMessageText}>
                {errorMessage}
              </ThemedText>
            </View>
          )}
          {/* Pokemon list */}
          {pokemons.length === 0 && !initialLoader && !refreshing ? (
            <View style={styles.emptyContainer}>
              <ThemedText>No Pokémon found. Please try again later.</ThemedText>
            </View>
          ) : (
            <FlashList
              data={filteredAndSortedPokemons}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              numColumns={NUM_COLUMNS}
              removeClippedSubviews
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              }
              ListFooterComponent={renderFooter}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
            />
          )}
          {/* Pokemon bottomsheet */}
          {selectedPokemon && (
            <PokemonBottomSheet
              sheetRef={bottomSheetRef}
              selectedPokemon={selectedPokemon}
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
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: "center",
  },
  errorMessageContainer: {
    padding: 10,
    backgroundColor: "#ffcccc",
    marginVertical: 10,
    borderRadius: 10,
  },
  errorMessageText: {
    color: "#ff0000",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
