import React from "react";
import { Platform, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";

import { CameraContainer } from "@/components/camera/CameraContainer";
import { NoCameraDeviceError } from "@/components/camera/NoCameraDeviceError";
import { PermissionsView } from "@/components/camera/PermissionsView";
import { ThemedSafeAreaView } from "@/components/common/ThemedSafeAreaView";

export default function PokemonCameraScreen() {
  const insets = useSafeAreaInsets();
  const device = useCameraDevice("front");
  const { hasPermission } = useCameraPermission();

  return (
    <SafeAreaProvider>
      <ThemedSafeAreaView style={styles.container}>
        <GestureHandlerRootView
          style={[
            styles.contentContainer,
            styles.containerShadow,
            {
              marginBottom: Platform.OS === "ios" ? insets.bottom + 30 : 70,
            },
          ]}
        >
          {!hasPermission ? (
            <PermissionsView />
          ) : device == null ? (
            <NoCameraDeviceError />
          ) : (
            <CameraContainer device={device} />
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
  contentContainer: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  containerShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: { width: 3, height: 3 },
  },
});
