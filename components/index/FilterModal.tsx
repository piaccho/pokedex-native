/* eslint-disable import/no-unresolved */
import { Image } from "expo-image";
import { Filter } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, View, ScrollView } from "react-native";

import { ThemedModal } from "../common/ThemedModal";
import { ThemedText } from "../common/ThemedText";

import { TYPE_IMAGES } from "@/assets/images/pokemon-types/typeImages";

interface FilterModalProps {
  selectedTypes: string[];
  onApplyFilters: (types: string[]) => void;
}

export const FilterModal = ({
  selectedTypes,
  onApplyFilters,
}: FilterModalProps) => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tempSelectedTypes, setTempSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    if (showFilterModal) {
      setTempSelectedTypes([...selectedTypes]);
    }
  }, [showFilterModal, selectedTypes]);

  // Handle type toggle for temp selection
  const handleTypeToggle = (type: string) => {
    setTempSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  // Apply filters handler
  const handleApplyFilters = () => {
    onApplyFilters(tempSelectedTypes);
    setShowFilterModal(false);
  };

  // Clear filters handler
  const handleClearFilters = () => {
    setTempSelectedTypes([]);
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  return (
    <>
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

      {/* Filter Modal */}
      <ThemedModal
        visible={showFilterModal}
        title="Filter by type"
        onClose={() => setShowFilterModal(false)}
      >
        <ScrollView style={styles.typeGrid}>
          <View style={styles.typesContainer}>
            {Object.keys(TYPE_IMAGES).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  tempSelectedTypes.includes(type) && styles.selectedTypeButton,
                ]}
                onPress={() => handleTypeToggle(type)}
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
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleClearFilters}
          >
            <ThemedText style={styles.buttonText}>Clear</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.applyButton]}
            onPress={handleApplyFilters}
          >
            <ThemedText style={[styles.buttonText, styles.applyButtonText]}>
              Apply
            </ThemedText>
          </TouchableOpacity>
        </View>
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
    lineHeight: 13,
    paddingLeft: 2,
    color: "red",
    fontSize: 9,
    fontWeight: "bold",
    fontFamily: "PokemonClassic",
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
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    alignItems: "center",
  },
  applyButton: {
    backgroundColor: "#fa4747",
  },
  applyButtonText: {
    color: "#fff",
  },
  buttonText: {
    fontFamily: "PokemonClassic",
    fontSize: 14,
    color: "#000",
  },
});
