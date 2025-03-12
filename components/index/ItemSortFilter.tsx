/* eslint-disable import/no-unresolved */
import { Image } from "expo-image";
import { ArrowUpDown, Filter } from "lucide-react-native";
import React, { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Modal,
  ScrollView,
} from "react-native";

import { TYPE_IMAGES } from "@/assets/images/pokemon-types/typeImages";

import { ThemedText } from "../common/ThemedText";
import { IconSymbol } from "../ui/IconSymbol";

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
}

export const ItemSortFilter = ({
  selectedTypes,
  onTypeSelect,
  sortDirection,
  onSortDirectionChange,
}: TypeFilterProps) => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  const handleSortPress = () => {
    setShowSortModal(true);
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const handleSelectSort = (direction: SortDirection) => {
    onSortDirectionChange(direction);
    setShowSortModal(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.sortFilterItem} onPress={handleSortPress}>
        <View style={styles.itemContent}>
          <ThemedText style={styles.itemText}>Sort</ThemedText>
          <ArrowUpDown color="#fff" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.sortFilterItem}
        onPress={handleFilterPress}
      >
        <View style={styles.itemContent}>
          <ThemedText style={styles.itemText}>Filter</ThemedText>
          <Filter color="#fff" />
          {selectedTypes.length > 0 && (
            <View style={styles.badge}>
              <ThemedText style={styles.badgeText}>
                {selectedTypes.length}
              </ThemedText>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowSortModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.containerShadow]}>
            <ThemedText style={styles.modalTitle}>Sort by</ThemedText>

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

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSortModal(false)}
            >
              <ThemedText style={styles.closeButtonText}>Close</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.containerShadow]}>
            <ThemedText style={styles.modalTitle}>Filter by type</ThemedText>

            <ScrollView style={styles.typeGrid}>
              <View style={styles.typesContainer}>
                {Object.keys(TYPE_IMAGES).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      selectedTypes.includes(type) && styles.selectedTypeButton,
                    ]}
                    onPress={() => onTypeSelect(type)}
                  >
                    <Image
                      source={TYPE_IMAGES[type as keyof typeof TYPE_IMAGES]}
                      style={styles.typeImage}
                    />
                    <ThemedText style={styles.typeText}>{type}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowFilterModal(false)}
            >
              <ThemedText style={styles.closeButtonText}>Close</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  containerShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
  },
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
  badge: {
    position: "absolute",
    top: -12,
    right: -12,
    backgroundColor: "white",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "red",
    fontSize: 12,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    maxHeight: "70%",
  },
  modalTitle: {
    fontFamily: "PokemonClassic",
    fontSize: 18,
    marginBottom: 20,
    color: "#000",
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
  typesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 5,
  },
  typeGrid: {
    maxHeight: 300,
    width: "100%",
  },
  typeButton: {
    width: 80,
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedTypeButton: {
    borderColor: "#f57575",
    backgroundColor: "#ffd3d3",
  },
  typeImage: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  typeText: {
    fontSize: 9,
    marginTop: 5,
    textAlign: "center",
    color: "#000",
    textTransform: "capitalize",
    fontFamily: "PokemonClassic",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    width: "100%",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    fontFamily: "PokemonClassic",
    fontSize: 14,
    color: "#000",
  },
});
