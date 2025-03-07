import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import { icons } from "@/assets/icons/icons";
import { HapticTab } from "@/components/HapticTab";
// import TabBarBackground from "@/components/ui/TabBarBackground";
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
        // tabBarBackground: TabBarBackground,
        tabBarBackground: () => (
          <View
            style={[StyleSheet.absoluteFill, { backgroundColor: "#d00" }]}
          />
        ),
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            // backgroundColor: Colors[colorScheme ?? "light"].background,

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
          tabBarIcon: ({ color }) => icons.pokedex(color),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color }) => icons.favorites(color),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "PokéAR",
          tabBarIcon: ({ color }) => icons.camera(color),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "PokéMap",
          tabBarIcon: ({ color }) => icons.map(color),
        }}
      />
    </Tabs>
  );
}
