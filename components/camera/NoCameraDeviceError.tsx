import React from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/common/ThemedText";
import { Colors } from "@/constants/Colors";

export const NoCameraDeviceError: React.FC = () => {
  return (
    <View style={[styles.messageContainer, styles.containerShadow]}>
      <ThemedText style={styles.errorText}>
        No camera device found on your device.
      </ThemedText>
      <ThemedText style={styles.errorText}>
        Please enable camera access in your device settings.
      </ThemedText>
    </View>
  );
};

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
  messageContainer: {
    width: "100%",
    backgroundColor: Colors.light.primary,
    borderRadius: 10,
    padding: 30,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  containerShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: { width: 3, height: 3 },
  },
  errorText: {
    fontSize: 16,
    fontFamily: "PokemonClassic",
    textAlign: "center",
  },
});
