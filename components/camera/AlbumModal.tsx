import { Asset } from "expo-asset";
import { startActivityAsync, ActivityAction } from "expo-intent-launcher";
import * as MediaLibrary from "expo-media-library";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Linking,
  Platform,
} from "react-native";

import { PokeSelfieItem } from "@/components/camera/PokeSelfieItem";
import { PokeSelfiePreviewModal } from "@/components/camera/PokeSelfiePreviewModal";
import { ThemedText } from "@/components/common/ThemedText";
import { Colors } from "@/constants/Colors";

const ALBUM_NAME = "PokeDexNative";

interface AlbumModalProps {
  visible: boolean;
  onClose: () => void;
  containerWidth: number;
  containerHeight: number;
}

export const AlbumModal: React.FC<AlbumModalProps> = ({
  visible,
  onClose,
  containerWidth,
  containerHeight,
}) => {
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [thumbnailAssetId, setThumbnailAssetId] = useState<string | null>(null);
  const [permissionModal, setPermissionModal] = useState(false);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions({
    get: true,
    request: false,
    writeOnly: false,
    granularPermissions: ["photo"],
  });
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);

  const isPermissionGranted = () => permissionResponse?.status === "granted";
  const hasFullAccess = () => permissionResponse?.accessPrivileges === "all";
  const hasLimitedAccess = () =>
    permissionResponse?.accessPrivileges === "limited";

  useEffect(() => {
    if (visible && isPermissionGranted() && hasFullAccess()) {
      fetchAlbumAssets();
    }
  }, [visible, permissionResponse]);

  const fetchAlbumAssets = async () => {
    try {
      const album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
      if (album) {
        // Get first asset to identify thumbnail
        const firstAsset = await MediaLibrary.getAssetsAsync({
          album,
          first: 1,
        });

        if (firstAsset.assets.length > 0) {
          setThumbnailAssetId(firstAsset.assets[0].id);
        }

        // Now get all assets
        const albumAssets = await MediaLibrary.getAssetsAsync({ album });
        setAssets(albumAssets.assets);
      } else {
        await setupPokeAlbum();
      }
    } catch (error) {
      console.error("Error fetching album assets:", error);
    }
  };

  const setupPokeAlbum = async () => {
    try {
      // Try to find existing album
      let album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);

      // Create album if it doesn't exist
      if (!album) {
        // Use app asset as album thumbnail
        const [pokeBallAsset] = await Asset.loadAsync(
          require("@/assets/images/poke-ball.png"),
        );

        if (!pokeBallAsset.localUri) {
          await pokeBallAsset.downloadAsync();
        }

        if (!pokeBallAsset.localUri) {
          throw new Error("Failed to get local URI for the image");
        }

        // Create asset for album thumbnail
        const albumThumbnailAsset = await MediaLibrary.createAssetAsync(
          pokeBallAsset.localUri,
        );

        setThumbnailAssetId(albumThumbnailAsset.id);

        album = await MediaLibrary.createAlbumAsync(
          ALBUM_NAME,
          albumThumbnailAsset,
        );
      }

      // Get assets from the album
      if (album) {
        const albumAssets = await MediaLibrary.getAssetsAsync({ album });
        setAssets(albumAssets.assets);
      }
    } catch (error) {
      console.error("Error setting up album:", error);
    }
  };

  const requestFullPermission = async () => {
    await requestPermission();
    setPermissionModal(false);
  };

  const openSettings = async () => {
    try {
      if (Platform.OS === "ios") {
        await Linking.openURL("app-settings:");
      } else {
        // For Android
        await startActivityAsync(ActivityAction.APPLICATION_DETAILS_SETTINGS, {
          data:
            "package:" + (Platform.constants as any).Package ||
            "com.anonymous.pokedexnative",
        });
      }
    } catch (error) {
      console.error("Error opening settings:", error);
    }
    setPermissionModal(false);
  };

  const renderPermissionModal = () => (
    <Modal
      visible={permissionModal}
      transparent
      animationType="fade"
      onRequestClose={() => setPermissionModal(false)}
    >
      <View style={styles.permissionModalOverlay}>
        <View style={styles.permissionModalContent}>
          {!isPermissionGranted() ? (
            <>
              <ThemedText style={styles.permissionText}>
                This app needs full access to your photo library to save and
                manage Pokémon photos.
              </ThemedText>
              <ThemedText style={styles.permissionText}>
                Please select "Allow Full Access" when prompted.
              </ThemedText>
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={requestFullPermission}
              >
                <ThemedText style={styles.permissionButtonText}>
                  Request Access
                </ThemedText>
              </TouchableOpacity>
            </>
          ) : hasLimitedAccess() ? (
            <>
              <ThemedText style={styles.permissionText}>
                You've granted limited access to your photos.
              </ThemedText>
              <ThemedText style={styles.permissionText}>
                To enable full access:
              </ThemedText>
              <View style={styles.instructionsContainer}>
                <ThemedText style={styles.instructionText}>
                  1. Open Settings
                </ThemedText>
                <ThemedText style={styles.instructionText}>
                  2. Tap Privacy & Security
                </ThemedText>
                <ThemedText style={styles.instructionText}>
                  3. Tap Photos
                </ThemedText>
                <ThemedText style={styles.instructionText}>
                  4. Find PokeDex and select "All Photos"
                </ThemedText>
              </View>
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={openSettings}
              >
                <ThemedText style={styles.permissionButtonText}>
                  Open Settings
                </ThemedText>
              </TouchableOpacity>
            </>
          ) : null}

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setPermissionModal(false)}
          >
            <ThemedText style={styles.closeButtonText}>Close</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const handleImagePress = (uri: string) => {
    setSelectedImageUri(uri);
    setPreviewModalVisible(true);
  };

  const closePreviewModal = () => {
    setPreviewModalVisible(false);
    // Optional: delay clearing the URI to prevent flicker during modal animation
    setTimeout(() => setSelectedImageUri(null), 300);
  };

  const renderAlbumContent = () => {
    // Filter out the thumbnail asset
    const displayAssets = assets.filter(
      (asset) => asset.id !== thumbnailAssetId,
    );

    const numColumns = 2;
    const itemWidth = (containerWidth - 40) / numColumns - 20; // Updated to account for PokeSelfie frame margins

    if (displayAssets.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <ThemedText style={styles.emptyText}>No PokéSelfies yet!</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Choose your favorite Pokémon and take a selfie with it!
          </ThemedText>
        </View>
      );
    }

    return (
      <FlatList
        data={displayAssets}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <PokeSelfieItem
            uri={item.uri}
            width={itemWidth}
            onPress={() => handleImagePress(item.uri)}
          />
        )}
        contentContainerStyle={styles.gridContainer}
      />
    );
  };

  const renderTopBar = () => {
    // Calculate number of photos (excluding thumbnail)
    const photoCount = assets.filter(
      (asset) => asset.id !== thumbnailAssetId,
    ).length;

    return (
      <View style={styles.topBar}>
        <View style={styles.photoCountContainer}>
          <ThemedText
            style={[styles.photoCountText, styles.photoCountTextIndicator]}
          >
            {photoCount}
          </ThemedText>
          <ThemedText style={styles.photoCountText}>
            {photoCount === 1 ? "PokéSelfie" : "PokéSelfies"}
          </ThemedText>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.backButtonContainer}>
          <ThemedText style={styles.backButtonText}>Back</ThemedText>
        </TouchableOpacity>
      </View>
    );
  };

  if (!visible) return null;

  return (
    <View
      style={[
        styles.albumScreenOverlay,
        { width: containerWidth, height: containerHeight },
      ]}
    >
      <View style={[styles.albumContainer, styles.containerShadow]}>
        {renderTopBar()}

        <View style={styles.contentContainer}>
          {isPermissionGranted() && hasFullAccess() ? (
            renderAlbumContent()
          ) : (
            <View style={styles.permissionNeededContainer}>
              <ThemedText style={styles.permissionNeededText}>
                Photo library access is needed to view your Pokémon photos
              </ThemedText>
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={() => setPermissionModal(true)}
              >
                <ThemedText style={styles.permissionButtonText}>
                  Grant Access
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {renderPermissionModal()}

        <PokeSelfiePreviewModal
          visible={previewModalVisible}
          imageUri={selectedImageUri}
          onClose={closePreviewModal}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  photoCountContainer: {
    flex: 3,
    paddingLeft: 10,
    flexDirection: "row",
    gap: 5,
  },
  photoCountText: {
    fontFamily: "PokemonClassic",
    fontSize: 14,
    color: "#000",
  },
  photoCountTextIndicator: {
    fontSize: 16,
  },
  backButtonContainer: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  albumScreenOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  albumContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    overflow: "hidden",
    padding: 15,
  },
  containerShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: { width: 3, height: 3 },
  },

  backButtonText: {
    fontFamily: "PokemonClassic",
    fontSize: 12,
    color: "white",
  },
  contentContainer: {
    flex: 1,
    marginTop: 10,
  },
  gridContainer: {
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontFamily: "PokemonClassic",
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
    color: Colors.light.primary,
  },
  emptySubtext: {
    fontFamily: "PokemonClassic",
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    lineHeight: 20,
  },
  permissionNeededContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionNeededText: {
    fontFamily: "PokemonClassic",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: Colors.light.primary,
  },
  permissionModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  permissionModalContent: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  permissionModalTitle: {
    fontFamily: "PokemonClassic",
    fontSize: 18,
    marginBottom: 20,
  },
  permissionText: {
    fontFamily: "PokemonClassic",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 10,
    color: "#555",
  },
  permissionButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
  },
  permissionButtonText: {
    fontFamily: "PokemonClassic",
    fontSize: 12,
    color: Colors.light.background,
  },
  closeButton: {
    backgroundColor: "#eee",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  closeButtonText: {
    fontFamily: "PokemonClassic",
    fontSize: 10,
    color: "#444",
  },
  instructionsContainer: {
    width: "100%",
    alignItems: "flex-start",
    paddingLeft: 10,
    marginVertical: 10,
  },
  instructionText: {
    fontFamily: "PokemonClassic",
    fontSize: 10,
    marginBottom: 6,
    color: "#555",
  },
});
