import { Image } from "expo-image";
import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";

import { ThemedText } from "@/components/common/ThemedText";
import { Colors } from "@/constants/Colors";

interface PokeSelfiePreviewModalProps {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
}

export const PokeSelfiePreviewModal: React.FC<PokeSelfiePreviewModalProps> = ({
  visible,
  imageUri,
  onClose,
}) => {
  if (!imageUri) return null;

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: imageUri }}
              style={[
                styles.previewImage,
                {
                  width: windowWidth * 0.9,
                  height: windowHeight * 0.6,
                },
              ]}
              contentFit="contain"
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <ThemedText style={styles.closeButtonText}>Close</ThemedText>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
  },
  previewContainer: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
    padding: 4,
    borderWidth: 1,
    borderColor: "#eee",
  },
  previewImage: {
    borderRadius: 4,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: Colors.light.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    fontFamily: "PokemonClassic",
    fontSize: 12,
    color: Colors.light.background,
  },
});
