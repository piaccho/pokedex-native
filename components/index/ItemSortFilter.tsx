import React from "react";
import { StyleSheet, View } from "react-native";

import { FilterModal } from "./FilterModal";
import { SortModal } from "./SortModal";

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
  NONE = "none",
}

interface TypeFilterProps {
  selectedTypes: string[];
  onTypeSelect: (type: string) => void;
  sortDirection: SortDirection;
  onSortDirectionChange: (direction: SortDirection) => void;
  onApplyFilters: (types: string[]) => void;
}

export const ItemSortFilter = ({
  selectedTypes,
  sortDirection,
  onSortDirectionChange,
  onApplyFilters,
}: TypeFilterProps) => {
  return (
    <View style={styles.container}>
      <SortModal
        sortDirection={sortDirection}
        onSortDirectionChange={onSortDirectionChange}
      />
      <FilterModal
        selectedTypes={selectedTypes}
        onApplyFilters={onApplyFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    gap: 10,
    height: 50,
    marginBottom: 10,
  },
});
