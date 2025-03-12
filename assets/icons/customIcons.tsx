/* eslint-disable import/no-unresolved */
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import ArIcon from "@/assets/icons/ar.svg";
import PokemonIcon from "@/assets/icons/pikachu.svg";
import PixelArrow from "@/assets/icons/pixel-arrow.svg";
import PixelList from "@/assets/icons/pixel-list.svg";
import PixelTrashCan from "@/assets/icons/pixel-trash-can.svg";

export const customIcons = {
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
  pixelArrowLeft: (color: string) => (
    <PixelArrow
      width={28}
      height={28}
      fill={color}
      transform="rotate(180, 0, 0)"
    />
  ),
  pixelArrowRight: (color: string) => (
    <PixelArrow width={28} height={28} fill={color} />
  ),
  pixelTrashCan: (color: string) => (
    <PixelTrashCan width={28} height={28} fill={color} />
  ),
  pixelList: (color: string) => (
    <PixelList width={28} height={28} fill={color} />
  ),
};

export type IconKeys = keyof typeof customIcons;
