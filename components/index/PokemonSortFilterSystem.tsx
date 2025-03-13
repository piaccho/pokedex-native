/* eslint-disable import/no-unresolved */
import React from "react";
import { View, StyleSheet } from "react-native";

import { ThemedText } from "@/components/common/ThemedText";
import {
  ItemSortFilter,
  SortDirection,
} from "@/components/index/ItemSortFilter";

interface PokemonSortFilterSystemProps {
  selectedTypes: string[];
  sortDirection: SortDirection;
  errorMessage?: string | null;
  onTypeSelect: (type: string) => void;
  onSortDirectionChange: (direction: SortDirection) => void;
  onApplyFilters: (types: string[]) => void;
}

export const PokemonSortFilterSystem: React.FC<
  PokemonSortFilterSystemProps
> = ({
  selectedTypes,
  sortDirection,
  errorMessage,
  onTypeSelect,
  onSortDirectionChange,
  onApplyFilters,
}) => {
  return (
    <>
      <ItemSortFilter
        selectedTypes={selectedTypes}
        onTypeSelect={onTypeSelect}
        sortDirection={sortDirection}
        onSortDirectionChange={onSortDirectionChange}
        onApplyFilters={onApplyFilters}
      />

      {errorMessage && (
        <View style={styles.errorMessageContainer}>
          <ThemedText style={styles.errorMessageText}>
            {errorMessage}
          </ThemedText>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  errorMessageContainer: {
    padding: 10,
    backgroundColor: "#ffcccc",
    marginVertical: 10,
    borderRadius: 10,
  },
  errorMessageText: {
    color: "#ff0000",
  },
});
