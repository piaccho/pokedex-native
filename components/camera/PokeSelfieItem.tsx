import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import { Colors } from "@/constants/Colors";

interface PokeSelfieItemProps {
  uri: string;
  width: number;
  onPress: () => void;
}

export const PokeSelfieItem: React.FC<PokeSelfieItemProps> = ({
  uri,
  width,
  onPress,
}) => {
  const frameHeight = width * 1.2; // pokeSelfie photos have roughly this aspect ratio

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View style={[styles.pokeSelfieFrame, { width, height: frameHeight }]}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri }} style={styles.image} contentFit="cover" />
        </View>
        <View style={styles.pokeSelfieBottom} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pokeSelfieFrame: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: Colors.dark.background, // Slight pink tint
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ffeeee",
  },
  imageWrapper: {
    flex: 0.85, // Take up 85% of the frame
    padding: 10,
  },
  image: {
    flex: 1,
    borderRadius: 5,
  },
  pokeSelfieBottom: {
    flex: 0.15, // Bottom 15% for the white strip
    backgroundColor: Colors.dark.background,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.background,
  },
});
