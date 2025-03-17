import React, { useCallback, useEffect, useState } from "react";
import { Linking, StyleSheet, View, TouchableOpacity } from "react-native";
import type { CameraPermissionStatus } from "react-native-vision-camera";
import { Camera } from "react-native-vision-camera";

import { ThemedText } from "@/components/common/ThemedText";
import { Colors } from "@/constants/Colors";

export function PermissionsView(): React.ReactElement {
  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>("not-determined");

  const requestCameraPermission = useCallback(async () => {
    console.log("Requesting camera permission...");
    const permission = await Camera.requestCameraPermission();
    console.log(`Camera permission status: ${permission}`);

    if (permission === "denied") await Linking.openSettings();
    setCameraPermissionStatus(permission);
  }, []);

  useEffect(() => {
    if (cameraPermissionStatus === "granted")
      console.log(`Camera permissions granted!`);
  }, [cameraPermissionStatus]);

  return (
    <View style={[styles.welcomeContainer, styles.containerShadow]}>
      <ThemedText style={styles.welcomeText}>Welcome to PokéAR</ThemedText>

      <View style={styles.permissionsContainer}>
        {cameraPermissionStatus !== "granted" && (
          <View style={styles.permissionRow}>
            <ThemedText style={styles.permissionText}>
              Camera permission required
            </ThemedText>
            <TouchableOpacity
              style={[styles.grantButton, styles.containerShadow]}
              onPress={requestCameraPermission}
            >
              <ThemedText style={styles.buttonText}>Grant</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeContainer: {
    width: "100%",
    backgroundColor: Colors.light.primary,
    borderRadius: 10,
    padding: 30,
    gap: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: "PokemonClassic",
    textAlign: "center",
    marginBottom: 20,
  },
  permissionsContainer: {
    gap: 20,
  },
  permissionRow: {
    alignItems: "center",
    gap: 15,
  },
  permissionText: {
    fontFamily: "PokemonClassic",
    fontSize: 16,
    textAlign: "center",
  },
  grantButton: {
    backgroundColor: Colors.light.background,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: "PokemonClassic",
    fontSize: 14,
    textAlign: "center",
    color: Colors.light.primary,
  },
  containerShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: { width: 3, height: 3 },
  },
});
