/* eslint-disable react/display-name */
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import axios from "axios";
import { Image, ImageStyle } from "expo-image";
import React, { useState, useEffect, memo, useCallback } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import usePokemonData from "@/hooks/usePokemonData";
import { PokemonDetail, PokemonResult } from "@/types/Pokemon.types";

// Constants
const ITEM_HEIGHT = 150;
const NUM_COLUMNS = 2;

interface PokemonItemProps {
  pokemonUrl: string;
}

const PokemonImage = memo(({ uri }: { uri: string }) => (
  <Image
    source={{ uri }}
    style={styles.image}
    placeholder={require("@/assets/images/poke-ball.png")}
  />
));

const PokemonItem = memo(({ pokemonUrl }: PokemonItemProps) => {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [error, setError] = useState<boolean>(false);

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

  return (
    <View style={styles.item}>
      <PokemonImage uri={pokemon.sprites.front_default} />
      <ThemedText style={styles.title}>{pokemon.name}</ThemedText>
    </View>
  );
});

// Debug Button component
const DebugButton = memo(({ pokemons }: { pokemons: PokemonResult[] }) => (
  <TouchableOpacity
    style={styles.debugButton}
    onPress={() => {
      console.log("Pokemon data: ", JSON.stringify(pokemons, null, 2));
      console.log(pokemons);
    }}
  >
    <IconSymbol name="ladybug" size={30} color="#999" />
  </TouchableOpacity>
));

export default function PokedexScreen() {
  const {
    pokemons,
    refreshing,
    loadingMore,
    handleRefresh,
    loadMore,
    initialLoader,
  } = usePokemonData();

  const renderItem: ListRenderItem<PokemonResult> = useCallback(
    ({ item }) => <PokemonItem pokemonUrl={item.url} />,
    [],
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
        <DebugButton pokemons={pokemons} />
        <FlashList
          data={pokemons}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          numColumns={NUM_COLUMNS}
          removeClippedSubviews
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListFooterComponent={renderFooter}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
        />
      </ThemedSafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
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
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  } as ImageStyle,
  title: {
    fontSize: 12,
    fontFamily: "PokemonClassic",
    color: "#000",
    textAlign: "center",
  },
  debugButton: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    position: "absolute",
    zIndex: 1,
    top: 70,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 100,
  },
});
