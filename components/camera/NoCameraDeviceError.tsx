import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const NoCameraDeviceError: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>
        No camera permissions. Please enable camera access in your device
        settings.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    margin: 20,
  },
});
