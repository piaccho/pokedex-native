import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function FavoritePokemonsScreen() {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const favoritesJson = await AsyncStorage.getItem("test-key");
      const favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
      setFavorites(favorites);
    } catch (e) {
      // error reading value
      console.log(`Error reading value: ${e}`);
    }
  };

  const toggleFavorite = async (value: number) => {
    try {
      const favoritesJson = await AsyncStorage.getItem("test-key");
      let favorites = favoritesJson ? JSON.parse(favoritesJson) : [];

      if (favorites.includes(value)) {
        favorites = favorites.filter((id: number) => id !== value);
      } else {
        favorites = [...favorites, value];
      }

      setFavorites(favorites);
      await AsyncStorage.setItem("test-key", JSON.stringify(favorites));
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    }
  };

  return (
    <SafeAreaProvider>
      <ThemedSafeAreaView style={styles.container}>
        <GestureHandlerRootView>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Your favorite Pokémons</ThemedText>
          </ThemedView>
          <View style={styles.container}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
              <TouchableOpacity
                key={id}
                style={styles.item}
                onPress={() => {
                  toggleFavorite(id);
                }}
              >
                {/* Based on favorite state apply proper style */}
                <ThemedText
                  style={[
                    styles.text,
                    favorites.includes(id) && styles.textFavorite,
                  ]}
                >
                  Pokemon {id}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </GestureHandlerRootView>
      </ThemedSafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    padding: 10,
  },
  item: {
    width: "45%",
    height: 200,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 10,
  },
  textFavorite: {
    fontFamily: "PokemonClassic",
    color: "gold",
  },
  text: {
    fontFamily: "PokemonClassic",
    color: "#000",
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
