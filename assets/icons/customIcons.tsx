import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import ArIcon from "@/assets/icons/ar.svg";
import BubbleText from "@/assets/icons/bubble-text.svg";
import PokemonIcon from "@/assets/icons/pikachu.svg";
import PixelArrow from "@/assets/icons/pixel-arrow.svg";
import PixelList from "@/assets/icons/pixel-list.svg";
import PixelTrashCan from "@/assets/icons/pixel-trash-can.svg";

type Orientation = "up" | "down" | "left" | "right";

// TODO: Remove it, just use the icons directly. Don't use MaterialIcons, use the Lucide icons instead.
export const customIcons = {
  pokedex: (color: string, size: number) => (
    <PokemonIcon width={size} height={size} fill={color} />
  ),
  favorites: (color: string, size: number) => (
    <MaterialIcons name="star" size={26} color={color} />
  ),
  camera: (color: string, size: number) => (
    <ArIcon fill={color} width={size} height={size} />
  ),
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
  bubbleText: (
    color: string,
    width: number,
    height: number,
    orientation: Orientation,
  ) => {
    let rotation;
    switch (orientation) {
      case "up":
        rotation = "rotate(180, 0, 0)";
        break;
      case "down":
        rotation = "rotate(0, 0, 0)";
        break;
      case "left":
        rotation = "rotate(90, 0, 0)";
        break;
      case "right":
        rotation = "rotate(-90, 0, 0)";
        break;
      default:
        rotation = "rotate(0, 0, 0)";
    }

    return (
      <BubbleText
        width={width}
        height={height}
        fill={color}
        transform={rotation}
        preserveAspectRatio="none"
      />
    );
  },
};

export type IconKeys = keyof typeof customIcons;
