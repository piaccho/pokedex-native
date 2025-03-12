/* eslint-disable import/no-unresolved */
import React from "react";
import { StyleSheet, View } from "react-native";

import { PushableButton } from "../common/PushableButton";

import { customIcons } from "@/assets/icons/customIcons";
import { useFavoritesStore } from "@/stores/useFavoritesStore";

// TODO: Get these from useThemeColor
const DISABLED_ICON_COLOR = "#ddd";
const ENABLED_ICON_COLOR = "#fa4747";

// Define navigation strategies
export enum NavigationStrategy {
  DOUBLE_ENDED = "double-ended",
  CAROUSEL = "carousel",
}

interface FavoritesNavigationProps {
  currentIndex: number;
  onIndexChange: (newIndex: number) => void;
  strategy: NavigationStrategy;
  totalItems: number;
}

export const FavoritesNavigation = ({
  currentIndex,
  onIndexChange,
  strategy = NavigationStrategy.DOUBLE_ENDED,
  totalItems,
}: FavoritesNavigationProps) => {
  const clearAllFavorites = useFavoritesStore(
    (state) => state.clearAllFavorites,
  );

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

  const handleClearFavorites = () => {
    clearAllFavorites();
  };

  const isAdditionalBtnsDisabled = totalItems === 0;
  const additionalBtnsIconColor = isAdditionalBtnsDisabled
    ? DISABLED_ICON_COLOR
    : ENABLED_ICON_COLOR;

  const clearFavoritesIcon = customIcons.pixelTrashCan(additionalBtnsIconColor);

  const handleQuickSelect = () => {
    // Quick select
  };

  const quickSelectIcon = customIcons.pixelList(additionalBtnsIconColor);

  return (
    <View style={[styles.container, styles.containerShadow]}>
      {/* Clear favorites pokemons */}
      <PushableButton
        onPress={handleClearFavorites}
        disabled={isAdditionalBtnsDisabled}
        icon={clearFavoritesIcon}
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

      {/* Quick select pokemon */}
      <PushableButton
        onPress={handleQuickSelect}
        disabled={isAdditionalBtnsDisabled}
        icon={quickSelectIcon}
        width={50}
        height={50}
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
    paddingHorizontal: 20,
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
  clearFavoritesBtn: {
    backgroundColor: "#f0f0f0",
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
