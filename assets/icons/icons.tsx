import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import ArIcon from "../../assets/icons/ar.svg";
import PokemonIcon from "../../assets/icons/pikachu.svg";

export const icons = {
  pokedex: (color: string) => (
    <PokemonIcon width={28} height={28} fill={color} />
  ),
  favorites: (color: string) => (
    <MaterialIcons name="star" size={26} color={color} />
  ),
  camera: (color: string) => <ArIcon fill={color} />,
  map: (color: string) => (
    <MaterialIcons name="pin-drop" size={28} color={color} />
  ),
};

export type IconKeys = keyof typeof icons;
