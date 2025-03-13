/* eslint-disable import/no-unresolved */
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { PokemonCard } from "@/components/common/PokemonCard";
import { PokemonDetail } from "@/types/Pokemon.types";

interface PokemonBottomSheetProps {
  sheetRef: React.RefObject<BottomSheet>;
  selectedPokemon?: PokemonDetail;
  onClose?: () => void;
}

export default function PokemonBottomSheet({
  sheetRef,
  selectedPokemon,
  onClose,
}: PokemonBottomSheetProps) {
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={1}
        appearsOnIndex={2}
        pressBehavior="close"
      />
    ),
    [],
  );

  // Handle sheet changes, including when it's closed
  const handleSheetChange = useCallback(
    (index: number) => {
      // When the sheet is fully closed (index -1), call onClose
      if (index === -1 && onClose) {
        onClose();
      }
    },
    [onClose],
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      onChange={handleSheetChange}
    >
      <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.contentContainer}>
          {selectedPokemon && (
            <PokemonCard
              pokemon={selectedPokemon}
              layout="detail"
              showDetails
              isClickable={false}
              key={`pokemon-detail-${selectedPokemon.id}`}
            />
          )}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "white",
  },
});
