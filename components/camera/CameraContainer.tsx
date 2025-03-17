/* eslint-disable import/no-unresolved */
import { useIsFocused } from "@react-navigation/native";
import { Images } from "lucide-react-native";
import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  AppState,
  LayoutChangeEvent,
} from "react-native";
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

import DebugButton from "../common/DebugButton";

import { customIcons } from "@/assets/icons/customIcons";
import BulbazaurImage from "@/assets/images/bulbazaur.svg";
import { TextBubble } from "@/components/camera/TextBubble";
import { ThemedText } from "@/components/common/ThemedText";
import { CameraConstants } from "@/constants/CameraConstants";
import { Colors } from "@/constants/Colors";

type PokeStickerPosition = {
  x: number;
  y: number;
  size?: number; // Optional size based on face size
};

const PokeStickersRenderer: React.FC<{
  pokeStickerPositions: PokeStickerPosition[];
  containerWidth: number;
}> = ({ pokeStickerPositions, containerWidth }) => {
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
            <BulbazaurImage
              width={size}
              height={size}
              // style={styles.pokemonSticker}
            />
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

  const isFocused = useIsFocused();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
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

  // const [albums, setAlbums] = useState(null);
  // const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  // const savePhoto = async () => {
  //   if (permissionResponse.status !== "granted") {
  //     await requestPermission();
  //   }
  //   const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
  //     includeSmartAlbums: true,
  //   });
  //   setAlbums(fetchedAlbums);
  // };

  const handleCapture = useCallback(async () => {
    console.log("Capture!");
    setShowBubble((prevState) => !prevState); // Toggle bubble to trigger animation
    const photo = await camera.current?.takePhoto();
  }, []);

  const handleViewGallery = useCallback(() => {
    console.log("View Gallery!");
  }, []);

  const handleSelectPokemon = useCallback(() => {
    console.log("Select Pokemon!");
  }, []);

  const toggleFrameProcessor = useCallback(() => {
    setIsFrameProcessorEnabled((prev) => !prev);
  }, []);

  return (
    <View style={styles.container} onLayout={handleContainerLayout}>
      <DebugButton
        action={() =>
          console.log(
            `Current container size: ${containerDimensions.width}x${containerDimensions.height}`,
          )
        }
      />
      {/* Camera takes most of the space */}
      <View style={[styles.cameraContainer, styles.containerShadow]}>
        {faceDetected && (
          <PokeStickersRenderer
            pokeStickerPositions={pokeStickerPositions}
            containerWidth={containerDimensions.width}
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
      </View>

      {/* Camera controls overlay */}
      <View style={styles.controlsOverlay}>
        {/* View Gallery Button */}
        <TouchableOpacity onPress={handleViewGallery}>
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

        {/* Frame processor toggle button */}
        <TouchableOpacity onPress={toggleFrameProcessor}>
          {customIcons.camera("white")}
        </TouchableOpacity>
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
});
