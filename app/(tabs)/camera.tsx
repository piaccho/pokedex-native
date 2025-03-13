import React from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";

import { NoCameraDeviceError } from "@/components/camera/NoCameraDeviceError";
import { PermissionsView } from "@/components/camera/PermissionsView";
import { ThemedSafeAreaView } from "@/components/common/ThemedSafeAreaView";

export default function PokemonCameraScreen() {
  const device = useCameraDevice("back");
  const { hasPermission } = useCameraPermission();

  return (
    <SafeAreaProvider>
      <ThemedSafeAreaView style={styles.container}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          {!hasPermission ? (
            <PermissionsView />
          ) : device == null ? (
            <NoCameraDeviceError />
          ) : (
            <Camera style={StyleSheet.absoluteFill} device={device} isActive />
          )}
        </GestureHandlerRootView>
      </ThemedSafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
