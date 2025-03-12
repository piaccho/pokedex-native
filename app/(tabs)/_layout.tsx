import { Tabs } from "expo-router";
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
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "PokéDex",
          tabBarIcon: ({ color }) => customIcons.pokedex(color),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color }) => customIcons.favorites(color),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "PokéAR",
          tabBarIcon: ({ color }) => customIcons.camera(color),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "PokéMap",
          tabBarIcon: ({ color }) => customIcons.map(color),
        }}
      />
    </Tabs>
  );
}
