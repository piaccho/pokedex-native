/* eslint-disable import/no-unresolved */
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { FavoriteButton } from "../FavoriteButton";
import { ThemedText } from "../ThemedText";
import { TypesContainer } from "./TypesContainer";

import { PokemonDetail } from "@/types/Pokemon.types";

interface StatRowProps {
  label: string;
  value: string | number;
}

const StatRow = ({ label, value }: StatRowProps) => (
  <View style={styles.statRow}>
    <ThemedText style={styles.statLabel}>{label}:</ThemedText>
    <ThemedText style={styles.statValue}>{value}</ThemedText>
  </View>
);

interface PokemonBottomSheetProps {
  sheetRef: React.RefObject<BottomSheet>;
  selectedPokemon: PokemonDetail;
}

export default function PokemonBottomSheet({
  sheetRef,
  selectedPokemon,
}: PokemonBottomSheetProps) {
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={1}
        appearsOnIndex={2}
      />
    ),
    [],
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
    >
      <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.contentContainer}>
          {selectedPokemon && (
            <View style={styles.bottomSheetContent}>
              <FavoriteButton
                pokemonId={selectedPokemon.id}
                style={styles.favButton}
              />
              <TypesContainer
                types={selectedPokemon.types}
                size={40}
                position="topLeft"
                style={styles.typesContainer}
              />
              <View style={styles.itemContainer}>
                <Image
                  source={{
                    uri: selectedPokemon.sprites.other.dream_world
                      .front_default,
                  }}
                  style={styles.largeImage}
                />
                <ThemedText style={styles.bottomSheetTitle}>
                  {selectedPokemon.name}
                </ThemedText>
              </View>

              <View style={styles.statsTable}>
                <StatRow label="Weight" value={selectedPokemon.weight} />
                <StatRow
                  label="Types"
                  value={selectedPokemon.types
                    .map((t) => t.type.name)
                    .join(", ")}
                />

                {/* Stats Section */}
                {selectedPokemon.stats.map((stat) => (
                  <StatRow
                    key={stat.stat.name}
                    label={stat.stat.name.replace("-", " ")}
                    value={stat.base_stat}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
  },
  contentContainer: {
    backgroundColor: "white",
  },
  typesContainer: {
    left: 20,
    top: 10,
  },
  favButton: {
    position: "absolute",
    top: 0,
    right: 10,
    padding: 10,
  },
  itemContainer: {
    marginTop: 40,
    marginBottom: 20,
  },
  bottomSheetContent: {
    alignItems: "center",
    padding: 15,
  },
  largeImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  bottomSheetTitle: {
    fontFamily: "PokemonClassic",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    color: "#000",
  },
  statsTable: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 15,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  statLabel: {
    flex: 1,
    textTransform: "capitalize",
    fontFamily: "PokemonClassic",
    fontSize: 12,
    color: "#000", // Add this line
  },
  statValue: {
    flex: 1,
    textAlign: "right",
    fontFamily: "PokemonClassic",
    fontSize: 12,
    color: "#000", // Add this line
  },
});
