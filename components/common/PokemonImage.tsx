/* eslint-disable react/display-name */

import { Image, ImageStyle } from "expo-image";
import React, { memo } from "react";
import { StyleSheet } from "react-native";

interface PokemonImageProps {
  uri: string;
}

const PokemonImage = memo(({ uri }: PokemonImageProps) => (
  <Image
    source={{ uri }}
    style={styles.image}
    placeholder={require("@/assets/images/poke-ball.png")}
  />
));

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  } as ImageStyle,
});

export default PokemonImage;
