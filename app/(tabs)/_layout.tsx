import { Tabs } from "expo-router";
import { Images } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";

import { customIcons } from "@/assets/icons/customIcons";
import { HapticTab } from "@/components/common/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
        tabBarLabelStyle: {
          fontFamily: "PokemonClassic",
          fontSize: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "PokéDex",
          tabBarIcon: ({ color }) => customIcons.pokedex(color, 28),
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: "Favorite",
          tabBarIcon: ({ color }) => customIcons.favorites(color, 28),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "PokéAR",
          tabBarIcon: ({ color }) => customIcons.camera(color, 28),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "PokéMap",
          tabBarIcon: ({ color }) => customIcons.map(color),
        }}
      />
      <Tabs.Screen
        name="skia"
        options={{
          title: "SkiaTest",
          tabBarIcon: ({ color }) => <Images color={color} />,
        }}
      />
    </Tabs>
  );
}
