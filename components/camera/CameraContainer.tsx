import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { Images } from "lucide-react-native";
import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  AppState,
  LayoutChangeEvent,
} from "react-native";
import ViewShot from "react-native-view-shot";
import {
  Camera,
  CameraDevice,
  useFrameProcessor,
} from "react-native-vision-camera";
import {
  Face,
  useFaceDetector,
  FaceDetectionOptions,
} from "react-native-vision-camera-face-detector";
import { Worklets } from "react-native-worklets-core";

import { customIcons } from "@/assets/icons/customIcons";
import BulbazaurImage from "@/assets/images/bulbazaur.svg";
import { AlbumModal } from "@/components/camera/AlbumModal";
import { TextBubble } from "@/components/camera/TextBubble";
import { PokemonSelectorModal } from "@/components/common/PokemonSelectorModal";
import { ThemedText } from "@/components/common/ThemedText";
import { CameraConstants } from "@/constants/CameraConstants";
import { Colors } from "@/constants/Colors";
import { PokemonDetail } from "@/types/Pokemon.types";

type PokeStickerPosition = {
  x: number;
  y: number;
  size?: number; // Optional size based on face size
};

interface PokeStickersRendererProps {
  pokeStickerPositions: PokeStickerPosition[];
  containerWidth: number;
  pokemonImageUri: string | null;
}

const PokeStickersRenderer: React.FC<PokeStickersRendererProps> = ({
  pokeStickerPositions,
  containerWidth,
  pokemonImageUri,
}: PokeStickersRendererProps) => {
  // Calculate a reasonable default size based on container width
  const defaultSize = containerWidth * 0.2; // 20% of container width

  return (
    <>
      {pokeStickerPositions.map((position, index) => {
        const size = position.size || defaultSize;

        return (
          <View
            key={index}
            style={[
              styles.pokemonStickerContainer,
              {
                // Position at center (adjusting for the image size)
                top: position.x,
                right: position.y,
              },
            ]}
          >
            {pokemonImageUri ? (
              <Image
                source={{ uri: pokemonImageUri }}
                style={{ width: size, height: size }}
                contentFit="contain"
              />
            ) : (
              <BulbazaurImage width={size} height={size} />
            )}
          </View>
        );
      })}
    </>
  );
};
interface CameraContainerProps {
  device: CameraDevice;
}

export const CameraContainer: React.FC<CameraContainerProps> = ({ device }) => {
  const camera = useRef<Camera>(null);

  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const isFocused = useIsFocused();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const [showPokemonSelector, setShowPokemonSelector] = useState(false);
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(
    null,
  );
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetail | null>(
    null,
  );
  // Get the pokemon image URI for the sticker
  const pokemonImageUri =
    pokemonDetails?.sprites.other.dream_world.front_default || null;

  // Fetch Pokemon details when selectedPokemonId changes
  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (!selectedPokemonId) return;

      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${selectedPokemonId}`,
        );
        setPokemonDetails(response.data);
      } catch (error) {
        console.error("Error fetching Pokemon details:", error);
      }

      // If not in store, fetch directly
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${selectedPokemonId}`,
        );
        setPokemonDetails(response.data);
      } catch (error) {
        console.error("Error fetching Pokemon details:", error);
      }
    };

    fetchPokemonDetails();
  }, [selectedPokemonId]);

  const isCameraActive = isFocused && appStateVisible === "active";
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Handle layout changes to get container dimensions
  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerDimensions({ width, height });
    console.log(`Container dimensions: ${width}x${height}`);
  }, []);

  // Handle screen state changes to pause camera when app is in background
  useEffect(() => {
    const appStateSubscription = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          console.log("App has come to the foreground!");
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        console.log("AppState", appState.current);
      },
    );

    return () => {
      appStateSubscription.remove();
    };
  }, []);

  const faceDetectionOptions = useRef<FaceDetectionOptions>({
    landmarkMode: "all",
  }).current;
  const { detectFaces } = useFaceDetector(faceDetectionOptions);

  const [pokeStickerPositions, setPokeStickerPositions] = useState<
    PokeStickerPosition[]
  >([]);
  const [faceDetected, setFaceDetected] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const [isFrameProcessorEnabled, setIsFrameProcessorEnabled] = useState(true);
  const captureContainerRef = useRef<ViewShot>(null);

  const handleDetectedFaces = Worklets.createRunOnJS(
    (faces: Face[], frameWidth: number, frameHeight: number) => {
      if (faces.length === 0) {
        setFaceDetected(false);
        return;
      }

      const scaleY = containerDimensions.width / frameWidth;
      const scaleX = containerDimensions.height / frameHeight;

      const currentPokeStickerPositions = [];
      for (const face of faces) {
        if (face.landmarks) {
          const foreheadOffset = face.bounds.height * 0.15;
          // Calculate size based on face dimensions
          const faceSize = Math.max(face.bounds.width, face.bounds.height);
          const stickerSize = faceSize * scaleX * 0.2;

          // Use the center of the face (or adjust as needed)
          currentPokeStickerPositions.push({
            x: scaleX * face.landmarks.NOSE_BASE.x - foreheadOffset,
            y: scaleY * face.landmarks.NOSE_BASE.y,
            size: stickerSize,
          });
        }
      }

      setPokeStickerPositions(currentPokeStickerPositions);
      setFaceDetected(true);
    },
  );

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";

      const faces = detectFaces(frame);
      handleDetectedFaces(faces, frame.height, frame.width);
    },
    [handleDetectedFaces],
  );

  const captureScreenshot = useCallback(async () => {
    // Capture the screen content
    let captureUri;

    if (!captureContainerRef.current) {
      console.warn("viewRef.current is null. Skipping screenshot capture.");
      return null;
    }

    try {
      captureUri = await captureContainerRef.current?.capture();
    } catch (error) {
      console.error("Error capturing photo:", error);
      return;
    }
    console.log("Capture URI:", captureUri);
    return captureUri;
  }, []);

  const mergeImages = useCallback(
    async (stickerOverlayUri: string, cameraPhotoUri: string) => {
      if (!stickerOverlayUri || !cameraPhotoUri) {
        console.error("Invalid images URIs");
        return;
      }

      try {
        // TODO: Implement image merging

        console.log("Merged image:", mergedImage);
        return mergedImage.uri;
      } catch (error) {
        console.error("Error merging images:", error);
        return null;
      }
    },
    [containerDimensions],
  );

  const handleCapture = useCallback(async () => {
    // For trigger click sound
    // TODO: remove temporary photo files (expo-file-system)
    const photo = await camera.current?.takePhoto();

    if (!photo) {
      console.error("Error taking photo");
      return;
    }

    console.log("Capture!");
    setShowBubble((prevState) => !prevState); // Toggle bubble to trigger animation

    const captureUri = await captureScreenshot();
    if (!captureUri) {
      console.error("Error capturing photo");
      return;
    }

    const mergedImagesUri = await mergeImages(captureUri, photo?.path);

    // Save image to camera roll
    const ALBUM_NAME = "PokeDexNative";

    // Check and request permissions
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("Media library permission denied");
      return;
    }

    try {
      // Save the image to the media library
      const asset = await MediaLibrary.createAssetAsync(mergedImagesUri);
      console.log("Image saved to media library:", asset);

      // Try to find existing album
      let album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);

      // Create album if it doesn't exist
      if (!album) {
        album = await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset);
        console.log(`Created new album: ${ALBUM_NAME}`);
      } else {
        // Add image to existing album
        await MediaLibrary.addAssetsToAlbumAsync([asset], album);
        console.log(`Added image to existing album: ${ALBUM_NAME}`);
      }

      console.log("PokéSelfie saved successfully!");
    } catch (error) {
      console.error("Error saving image to gallery:", error);
    }
  }, []);

  const handleOpenGallery = useCallback(() => {
    toggleFrameProcessor();
    setShowAlbumModal(true);
  }, []);

  const handleCloseGallery = useCallback(() => {
    toggleFrameProcessor();
    setShowAlbumModal(false);
  }, []);

  const handleSelectPokemon = useCallback(() => {
    toggleFrameProcessor();
    setShowPokemonSelector(true);
  }, []);

  const handleClosePokemonSelector = useCallback(() => {
    toggleFrameProcessor();
    setShowPokemonSelector(false);
  }, []);

  const handlePokemonSelected = useCallback((pokemonId: number) => {
    setSelectedPokemonId(pokemonId);
    console.log(`Selected Pokemon ID: ${pokemonId}`);
  }, []);

  const toggleFrameProcessor = useCallback(() => {
    setIsFrameProcessorEnabled((prev) => !prev);
  }, []);

  return (
    <View style={styles.container} onLayout={handleContainerLayout}>
      {/* Album Modal */}
      <AlbumModal
        visible={showAlbumModal}
        onClose={handleCloseGallery}
        containerWidth={containerDimensions.width}
        containerHeight={containerDimensions.height}
      />

      {/* Pokemon Image Selector Modal */}
      <PokemonSelectorModal
        visible={showPokemonSelector}
        onClose={handleClosePokemonSelector}
        onSelectPokemon={handlePokemonSelected}
        title="Select Pokémon"
        currentPokemonId={selectedPokemonId || undefined}
      />

      {/* Camera */}
      <ViewShot
        ref={captureContainerRef}
        options={{
          format: "png",
          quality: 0.8,
        }}
        style={[
          styles.cameraContainer,
          // styles.containerShadow
        ]}
      >
        {isFrameProcessorEnabled && faceDetected && (
          <PokeStickersRenderer
            pokeStickerPositions={pokeStickerPositions}
            containerWidth={containerDimensions.width}
            pokemonImageUri={pokemonImageUri}
          />
        )}
        <Camera
          ref={camera}
          style={styles.camera}
          device={device}
          isActive={isCameraActive}
          photo
          frameProcessor={isFrameProcessorEnabled ? frameProcessor : undefined}
        />
      </ViewShot>

      {/* Camera controls overlay */}
      <View style={styles.controlsOverlay}>
        {/* View Gallery Button */}
        <TouchableOpacity onPress={handleOpenGallery}>
          <Images color="white" size={35} />
        </TouchableOpacity>

        {/* Capture Button */}
        <TouchableOpacity
          style={[styles.captureButton, styles.containerShadow]}
          onPress={handleCapture}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>

        {/* Select Pokemon Button */}
        <TouchableOpacity onPress={handleSelectPokemon}>
          {customIcons.pokedex("white", 35)}
        </TouchableOpacity>

        {__DEV__ && (
          // Debug button to toggle frame processor
          <TouchableOpacity onPress={toggleFrameProcessor}>
            <View style={styles.iconContainer}>
              {customIcons.camera("white", 30)}
              {!isFrameProcessorEnabled && (
                <View style={styles.disabledIconLine} />
              )}
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Title bar */}
      <View style={[styles.titleBar, styles.containerShadow]}>
        <ThemedText style={styles.titleText}>PokéAR Camera</ThemedText>
      </View>

      {/* Animated Hint Bubble */}
      <TextBubble
        text={[
          "Put your favorite Pokemon",
          "on your face and take a pic!",
          ":D",
        ]}
        width={CameraConstants.BUBBLE_WIDTH}
        height={CameraConstants.BUBBLE_HEIGHT}
        bubbleColor={Colors.light.background}
        textColor={Colors.light.primary}
        style={styles.hintBubbleContainer}
        triggerAnimation={showBubble}
        displayDuration={3000}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pokemonStickerContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: "red",
  },
  container: {
    flex: 1,
    width: "100%",
    position: "relative",
  },
  cameraContainer: {
    flex: 1,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  titleBar: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.primary,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    alignItems: "center",
  },
  titleText: {
    fontFamily: "PokemonClassic",
    fontSize: 16,
  },
  controlsOverlay: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.light.background,
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  containerShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: { width: 3, height: 3 },
  },
  hintBubbleContainer: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  // frameProcessorEnabled icon
  iconContainer: {
    position: "relative",
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },

  disabledIconLine: {
    position: "absolute",
    width: 48,
    height: 3,
    backgroundColor: "#fff",
    borderRadius: 1.5,
    transform: [{ rotate: "45deg" }],
    top: "50%",
    marginTop: -1.5,
  },
});
