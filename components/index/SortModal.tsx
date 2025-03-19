import { ArrowUpDown } from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";

import { SortDirection } from "./ItemSortFilter";
import { ThemedModal } from "../common/ThemedModal";
import { ThemedText } from "../common/ThemedText";
import { IconSymbol } from "../ui/IconSymbol";

interface SortModalProps {
  sortDirection: SortDirection;
  onSortDirectionChange: (direction: SortDirection) => void;
}

export const SortModal = ({
  sortDirection,
  onSortDirectionChange,
}: SortModalProps) => {
  const [showSortModal, setShowSortModal] = useState(false);

  const handleSortPress = () => {
    setShowSortModal(true);
  };

  const handleSelectSort = (direction: SortDirection) => {
    onSortDirectionChange(direction);
    setShowSortModal(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.sortFilterItem} onPress={handleSortPress}>
        <View style={styles.itemContent}>
          <ThemedText style={styles.itemText}>Sort</ThemedText>
          <ArrowUpDown color="#fff" />
        </View>
      </TouchableOpacity>

      {/* Sort Modal */}
      <ThemedModal
        visible={showSortModal}
        title="Sort by"
        onClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity
          style={[
            styles.sortOption,
            sortDirection === SortDirection.ASC && styles.selectedOption,
          ]}
          onPress={() => handleSelectSort(SortDirection.ASC)}
        >
          <IconSymbol name="sort" size={24} color="#000" />
          <ThemedText style={styles.sortOptionText}>A to Z</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sortOption,
            sortDirection === SortDirection.DESC && styles.selectedOption,
          ]}
          onPress={() => handleSelectSort(SortDirection.DESC)}
        >
          <IconSymbol
            name="sort"
            size={24}
            color="#000"
            style={{ transform: [{ scaleY: -1 }] }}
          />
          <ThemedText style={styles.sortOptionText}>Z to A</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sortOption,
            sortDirection === SortDirection.NONE && styles.selectedOption,
          ]}
          onPress={() => handleSelectSort(SortDirection.NONE)}
        >
          <IconSymbol name="restore" size={24} color="#000" />
          <ThemedText style={styles.sortOptionText}>Default</ThemedText>
        </TouchableOpacity>
      </ThemedModal>
    </>
  );
};

const styles = StyleSheet.create({
  sortFilterItem: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "#fa4747",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: { width: 3, height: 3 },
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    position: "relative",
  },
  itemText: {
    fontFamily: "PokemonClassic",
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    width: "100%",
    marginVertical: 5,
    borderRadius: 5,
    gap: 10,
  },
  selectedOption: {
    backgroundColor: "#e0e0e0",
  },
  sortOptionText: {
    fontFamily: "PokemonClassic",
    fontSize: 14,
    color: "#000",
  },
});
