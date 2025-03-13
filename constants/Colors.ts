/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    primary: "#fa4747",
    disabled: "#ddd",
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    primary: "#fa4747",
    disabled: "#ddd",
    text: "#ECEDEE",
    background: "#d47d7d",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#5f0505",
    tabIconSelected: tintColorDark,
  },
};
