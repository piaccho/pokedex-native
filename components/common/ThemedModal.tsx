import React from "react";
import {
  DimensionValue,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "./ThemedText";

interface ThemedModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxHeight?: string | number;
}

export const ThemedModal = ({
  visible,
  title,
  onClose,
  children,
  maxHeight = "70%",
}: ThemedModalProps) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            styles.containerShadow,
            { maxHeight: maxHeight as DimensionValue },
          ]}
        >
          <ThemedText style={styles.modalTitle}>{title}</ThemedText>

          {children}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <ThemedText style={styles.closeButtonText}>Close</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  containerShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: { width: 3, height: 3 },
  },
  modalTitle: {
    fontFamily: "PokemonClassic",
    fontSize: 18,
    marginBottom: 20,
    color: "#000",
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    width: "100%",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    fontFamily: "PokemonClassic",
    fontSize: 14,
    color: "#000",
  },
});
