/* eslint-disable import/no-unresolved */
import { Image } from "expo-image";
import React, { useRef, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  LayoutChangeEvent,
} from "react-native";

import { FavoriteButton } from "@/components/common/FavoriteButton";
import { ThemedText } from "@/components/common/ThemedText";
import { TypesContainer } from "@/components/common/TypesContainer";
import { PokemonDetail } from "@/types/Pokemon.types";
import { formatPokemonName } from "@/utils/pokemonUtils";

export type PokemonCardLayout = "grid" | "detail" | "favorite";

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

interface PokemonCardProps {
  pokemon: PokemonDetail;
  layout: PokemonCardLayout;
  showDetails?: boolean;
  isClickable?: boolean;
  isFavButtonClickable?: boolean;
  showFavButtonAlways?: boolean;
  onPress?: (pokemon: PokemonDetail) => void;
}

export const PokemonCard = ({
  pokemon,
  layout = "grid",
  showDetails = false,
  isClickable = true,
  isFavButtonClickable = true,
  showFavButtonAlways = true,
  onPress,
}: PokemonCardProps) => {
  const [isScrollable, setIsScrollable] = useState(false);
  const contentHeight = useRef(0);
  const containerHeight = useRef(0);

  const checkScrollable = () => {
    setIsScrollable(contentHeight.current > containerHeight.current);
  };

  const handlePress = () => {
    if (isClickable && onPress) {
      onPress(pokemon);
    }
  };

  const displayName = formatPokemonName(pokemon.name);

  // Get image source based on layout
  const getImageSource = () => {
    if (layout === "detail" || layout === "favorite") {
      return {
        uri:
          pokemon.sprites.other.dream_world.front_default ||
          pokemon.sprites.front_default,
      };
    }
    return { uri: pokemon.sprites.front_default };
  };

  // Get container style based on layout
  const getContainerStyle = () => {
    switch (layout) {
      case "grid":
        return [styles.container, styles.gridContainer, styles.containerShadow];
      case "detail":
        return [styles.container, styles.detailContainer];
      case "favorite":
        return [
          styles.container,
          styles.favoriteContainer,
          styles.containerShadow,
        ];
      default:
        return styles.container;
    }
  };

  // Get image style based on layout
  const getImageStyle = () => {
    switch (layout) {
      case "grid":
        return styles.gridImage;
      case "detail":
        return styles.detailImage;
      case "favorite":
        return styles.favoriteImage;
      default:
        return styles.gridImage;
    }
  };

  // Get title style based on layout
  const getTitleStyle = () => {
    switch (layout) {
      case "grid":
        return styles.gridTitle;
      case "detail":
        return styles.detailTitle;
      case "favorite":
        return styles.favoriteTitle;
      default:
        return styles.gridTitle;
    }
  };

  // Render stats section with scrolling if needed
  const renderStatsSection = () => {
    if (!showDetails) return null;

    return (
      <View
        style={styles.statsContainer}
        onLayout={(event: LayoutChangeEvent) => {
          containerHeight.current = event.nativeEvent.layout.height;
          checkScrollable();
        }}
      >
        <ScrollView
          style={styles.statsScrollView}
          contentContainerStyle={styles.statsContentContainer}
          showsVerticalScrollIndicator={isScrollable}
          indicatorStyle="black" // iOS scrollbar color - 'black', 'white', or 'default'
          scrollIndicatorInsets={{ right: 1 }} // Controls scrollbar positioning
          nestedScrollEnabled
          onContentSizeChange={(_, height) => {
            contentHeight.current = height;
            checkScrollable();
          }}
        >
          <StatRow label="Weight" value={pokemon.weight} />
          <StatRow
            label="Types"
            value={pokemon.types.map((t) => t.type.name).join(", ")}
          />
          {pokemon.stats.map((stat) => (
            <StatRow
              key={stat.stat.name}
              label={stat.stat.name.replace("-", " ")}
              value={stat.base_stat}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderContent = () => (
    <>
      {/* Types and Favorite button */}
      <TypesContainer
        types={pokemon.types}
        size={layout === "grid" ? 20 : 40}
        position={layout === "favorite" ? "topMiddle" : "topLeft"}
        style={layout === "detail" ? styles.detailTypesContainer : undefined}
      />

      {layout !== "favorite" && (
        <FavoriteButton
          pokemonId={pokemon.id}
          position={layout === "detail" ? "topRight" : "topRight"}
          size={layout === "grid" ? 25 : 40}
          isClickable={isFavButtonClickable}
          showAlways={showFavButtonAlways}
          style={layout === "detail" ? styles.detailFavButton : undefined}
        />
      )}

      {/* Pokemon Image */}
      <Image
        source={getImageSource()}
        style={getImageStyle()}
        placeholder={require("@/assets/images/poke-ball.png")}
      />

      {/* Pokemon Name */}
      <ThemedText style={getTitleStyle()}>{displayName}</ThemedText>

      {/* Scrollable Stats Section */}
      {renderStatsSection()}
    </>
  );

  // Render with or without touch functionality based on isClickable prop
  return isClickable ? (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={handlePress}
      disabled={!isClickable}
    >
      {renderContent()}
    </TouchableOpacity>
  ) : (
    <View style={getContainerStyle()}>{renderContent()}</View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  gridContainer: {
    flex: 1,
    height: 150,
    margin: 5,
  },
  detailContainer: {
    width: "100%",
    padding: 15,
  },
  favoriteContainer: {
    width: "100%",
    height: "100%",
  },
  containerShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: { width: 3, height: 3 },
  },
  gridImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  detailImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginTop: 40,
    marginBottom: 20,
  },
  favoriteImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  gridTitle: {
    fontSize: 12,
    fontFamily: "PokemonClassic",
    color: "#000",
    textAlign: "center",
  },
  detailTitle: {
    fontFamily: "PokemonClassic",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    color: "#000",
    textAlign: "center",
  },
  favoriteTitle: {
    fontFamily: "PokemonClassic",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "#000",
    textAlign: "center",
  },
  // New stats container styles
  statsContainer: {
    width: "100%",
    marginTop: 15,
    maxHeight: 200, // Set maximum height to ensure scrollability
  },
  statsScrollView: {
    width: "100%",
  },
  statsContentContainer: {
    paddingHorizontal: 20,
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
    color: "#000",
  },
  statValue: {
    flex: 1,
    textAlign: "right",
    fontFamily: "PokemonClassic",
    fontSize: 12,
    color: "#000",
  },
  detailTypesContainer: {
    left: 20,
    top: 10,
  },
  detailFavButton: {
    position: "absolute",
    top: 0,
    right: 10,
    padding: 10,
  },
});
