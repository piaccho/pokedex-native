/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { customIcons } from "@/assets/icons/customIcons";
import { Colors } from "@/constants/Colors";
import { useFavoritesStore } from "@/stores/useFavoritesStore";

import { QuickSelectModal } from "./QuickSelectModal";
import { PushableButton } from "../common/PushableButton";

const ENABLED_ICON_COLOR = Colors.light.primary;
const DISABLED_ICON_COLOR = Colors.light.disabled;

// Define navigation strategies
export enum NavigationStrategy {
  DOUBLE_ENDED = "double-ended",
  CAROUSEL = "carousel",
}

interface FavoritesScreenOptionsProps {
  currentIndex: number;
  onIndexChange: (newIndex: number) => void;
  strategy: NavigationStrategy;
  totalItems: number;
}

export const FavoritesScreenOptions = ({
  currentIndex,
  onIndexChange,
  strategy = NavigationStrategy.DOUBLE_ENDED,
  totalItems,
}: FavoritesScreenOptionsProps) => {
  const favorites = useFavoritesStore((state) => state.favorites);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const pokemonDetails = useFavoritesStore((state) => state.pokemonDetails);
  const isLoading = useFavoritesStore((state) => state.isLoading);
  const fetchAllFavoriteDetails = useFavoritesStore(
    (state) => state.fetchAllFavoriteDetails,
  );

  const [showQuickSelectModal, setShowQuickSelectModal] = useState(false);

  // Fetch Pokemon details when the modal opens
  useEffect(() => {
    if (showQuickSelectModal) {
      fetchAllFavoriteDetails();
    }
  }, [showQuickSelectModal, fetchAllFavoriteDetails]);

  // Navigation logic
  const handlePrevious = () => {
    if (totalItems === 0) return; // Guard against empty lists

    if (strategy === NavigationStrategy.CAROUSEL) {
      // For carousel: wrap around to the end if at the beginning
      onIndexChange((currentIndex - 1 + totalItems) % totalItems);
    } else {
      // For double-ended: don't go below 0
      onIndexChange(Math.max(0, currentIndex - 1));
    }
  };

  const handleNext = () => {
    if (totalItems === 0) return; // Guard against empty lists

    if (strategy === NavigationStrategy.CAROUSEL) {
      // For carousel: wrap around to the beginning if at the end
      onIndexChange((currentIndex + 1) % totalItems);
    } else {
      // For double-ended: don't go beyond total items
      onIndexChange(Math.min(totalItems - 1, currentIndex + 1));
    }
  };

  // Calculate button states - disable ALL buttons when there are no items
  // regardless of which navigation strategy is being used
  const isPreviousDisabled =
    totalItems === 0 ||
    (strategy === NavigationStrategy.DOUBLE_ENDED && currentIndex === 0);

  const isNextDisabled =
    totalItems === 0 ||
    (strategy === NavigationStrategy.DOUBLE_ENDED &&
      currentIndex === totalItems - 1);

  // Ensure we always have icons, even when disabled
  const leftIcon = customIcons.pixelArrowLeft(
    isPreviousDisabled ? DISABLED_ICON_COLOR : ENABLED_ICON_COLOR,
  );
  const rightIcon = customIcons.pixelArrowRight(
    isNextDisabled ? DISABLED_ICON_COLOR : ENABLED_ICON_COLOR,
  );

  // Replace the handleUnfavorite function with this:
  const handleUnfavorite = () => {
    if (totalItems === 0) return;

    // Get the actual Pokémon ID from the favorites array using the current index
    const pokemonId = favorites[currentIndex];
    if (pokemonId) {
      toggleFavorite(pokemonId);

      // If this was the last Pokémon and we just unfavorited it,
      // we need to adjust the current index
      if (currentIndex >= favorites.length - 1 && currentIndex > 0) {
        onIndexChange(currentIndex - 1);
      }
    }
  };

  const isAdditionalBtnsDisabled = totalItems === 0;
  const additionalBtnsIconColor = isAdditionalBtnsDisabled
    ? DISABLED_ICON_COLOR
    : ENABLED_ICON_COLOR;

  const unfavoriteIcon = customIcons.pixelTrashCan(additionalBtnsIconColor);

  const handleQuickSelect = () => {
    setShowQuickSelectModal(true);
  };

  // Add handler for selecting a Pokemon
  const handleSelectPokemon = (index: number) => {
    onIndexChange(index);
    setShowQuickSelectModal(false);
  };

  const quickSelectIcon = customIcons.pixelList(additionalBtnsIconColor);

  return (
    <View style={[styles.container, styles.containerShadow]}>
      {/* Unfavorite pokemon button */}
      <PushableButton
        onPress={handleUnfavorite}
        disabled={isAdditionalBtnsDisabled}
        icon={unfavoriteIcon}
        width={50}
        height={50}
      />

      {/* Navigation pokemon */}
      <View style={styles.arrowsContainer}>
        <PushableButton
          onPress={handlePrevious}
          disabled={isPreviousDisabled}
          icon={leftIcon}
          style={styles.leftArrowBtn}
          height={80}
        />

        <PushableButton
          onPress={handleNext}
          disabled={isNextDisabled}
          icon={rightIcon}
          style={styles.rightArrowBtn}
          height={80}
        />
      </View>

      {/* Quick select pokemon button */}
      <PushableButton
        onPress={handleQuickSelect}
        disabled={isAdditionalBtnsDisabled}
        icon={quickSelectIcon}
        width={50}
        height={50}
      />

      {/* Quick Select Modal */}
      <QuickSelectModal
        visible={showQuickSelectModal}
        onClose={() => setShowQuickSelectModal(false)}
        favorites={favorites}
        pokemonDetails={pokemonDetails}
        isLoading={isLoading}
        currentIndex={currentIndex}
        onSelectPokemon={handleSelectPokemon}
        accentColor={ENABLED_ICON_COLOR}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: 8,
    borderRadius: 10,
    padding: 15,
    backgroundColor: ENABLED_ICON_COLOR,
  },
  containerShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: { width: 3, height: 3 },
  },
  arrowsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  leftArrowBtn: {
    paddingRight: 15,
    paddingTop: 15,
  },
  rightArrowBtn: {
    paddingLeft: 15,
    paddingTop: 15,
  },
});
