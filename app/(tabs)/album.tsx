/* eslint-disable import/no-unresolved */
import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  Alert,
  Linking,
  Platform,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import Permissions, { PERMISSIONS } from "react-native-permissions";

export default function AlbumScreen() {
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const openSettingsAlert = useCallback(({ title }: { title: string }) => {
    Alert.alert(title, "", [
      {
        isPreferred: true,
        style: "default",
        text: "Open Settings",
        onPress: () => Linking?.openSettings(),
      },
      {
        isPreferred: false,
        style: "destructive",
        text: "Cancel",
        onPress: () => {},
      },
    ]);
  }, []);

  const checkAndroidPermissions = useCallback(async () => {
    if (parseInt(Platform.Version as string, 10) >= 33) {
      const permissions = await Permissions.checkMultiple([
        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
        PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
      ]);
      if (
        permissions[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] ===
          Permissions.RESULTS.GRANTED &&
        permissions[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] ===
          Permissions.RESULTS.GRANTED
      ) {
        setHasPermission(true);
        return;
      }
      const res = await Permissions.requestMultiple([
        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
        PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
      ]);
      if (
        res[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] ===
          Permissions.RESULTS.GRANTED &&
        res[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] ===
          Permissions.RESULTS.GRANTED
      ) {
        setHasPermission(true);
      }
      if (
        res[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] ===
          Permissions.RESULTS.DENIED ||
        res[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] === Permissions.RESULTS.DENIED
      ) {
        checkAndroidPermissions();
      }
      if (
        res[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] ===
          Permissions.RESULTS.BLOCKED ||
        res[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] ===
          Permissions.RESULTS.BLOCKED
      ) {
        openSettingsAlert({
          title: "Please allow access to your photos and videos from settings",
        });
      }
    } else {
      const permission = await Permissions.check(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );
      if (permission === Permissions.RESULTS.GRANTED) {
        setHasPermission(true);
        return;
      }
      const res = await Permissions.request(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );
      if (res === Permissions.RESULTS.GRANTED) {
        setHasPermission(true);
      }
      if (res === Permissions.RESULTS.DENIED) {
        checkAndroidPermissions();
      }
      if (res === Permissions.RESULTS.BLOCKED) {
        openSettingsAlert({
          title: "Please allow access to the photo library from settings",
        });
      }
    }
  }, [openSettingsAlert]);

  const checkPermission = useCallback(async () => {
    if (Platform.OS === "ios") {
      const permission = await Permissions.check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (
        permission === Permissions.RESULTS.GRANTED ||
        permission === Permissions.RESULTS.LIMITED
      ) {
        setHasPermission(true);
        return;
      }
      const res = await Permissions.request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (
        res === Permissions.RESULTS.GRANTED ||
        res === Permissions.RESULTS.LIMITED
      ) {
        setHasPermission(true);
      }
      if (res === Permissions.RESULTS.BLOCKED) {
        openSettingsAlert({
          title: "Please allow access to the photo library from settings",
        });
      }
    } else if (Platform.OS === "android") {
      checkAndroidPermissions();
    }
  }, [checkAndroidPermissions, openSettingsAlert]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return (
    <SafeAreaView>
      <Text
        style={{
          fontSize: 22,
          textAlign: "center",
          fontWeight: "600",
          padding: 24,
        }}
      >
        {`Permission: ${hasPermission ? "Granted ✅" : "Denied ❌"}`}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  albumImage: {
    width: 40,
    height: 40,
    margin: 5,
  },
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

// TODO: Expo MediaLibrary is not working

// /* eslint-disable import/no-unresolved */
// import { Image } from "expo-image";
// import * as MediaLibrary from "expo-media-library";
// import React, { useEffect, useState } from "react";
// import { Button, Platform, ScrollView, StyleSheet, View } from "react-native";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import {
//   SafeAreaProvider,
//   useSafeAreaInsets,
// } from "react-native-safe-area-context";

// import { ThemedSafeAreaView } from "@/components/common/ThemedSafeAreaView";
// import { ThemedText } from "@/components/common/ThemedText";

// export default function AlbumScreen() {
//   const insets = useSafeAreaInsets();

//   const [albums, setAlbums] = useState<MediaLibrary.Album[] | null>(null);
//   const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

//   async function getAlbums() {
//     console.log(`DEBUG 1`);
//     console.log(permissionResponse);
//     if (permissionResponse?.status !== "granted") {
//       console.log(`DEBUG 2`);
//       console.log(JSON.stringify(requestPermission));
//       // await requestPermission();
//       const { status } = await MediaLibrary.requestPermissionsAsync();
//       console.log(`status: ${status}`);
//       console.log(`DEBUG 3`);
//     }
//     console.log(`DEBUG 4`);
//     const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
//       includeSmartAlbums: true,
//     });
//     console.log(`DEBUG 5`);
//     setAlbums(fetchedAlbums);
//     console.log(`DEBUG 6`);
//   }

//   return (
//     <SafeAreaProvider>
//       <ThemedSafeAreaView style={styles.container}>
//         <GestureHandlerRootView
//           style={[
//             styles.contentContainer,
//             styles.containerShadow,
//             {
//               marginBottom: Platform.OS === "ios" ? insets.bottom + 30 : 70,
//             },
//           ]}
//         >
//           <Button
//             title="Get medialibrary permissions"
//             onPress={() => MediaLibrary.requestPermissionsAsync()}
//           />
//           <Button onPress={getAlbums} title="Get albums" />
//           <ScrollView>
//             {albums && albums.map((album) => <AlbumEntry album={album} />)}
//           </ScrollView>
//         </GestureHandlerRootView>
//       </ThemedSafeAreaView>
//     </SafeAreaProvider>
//   );
// }

// function AlbumEntry({ album }: { album: MediaLibrary.Album }) {
//   const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);

//   useEffect(() => {
//     async function getAlbumAssets() {
//       const albumAssets = await MediaLibrary.getAssetsAsync({ album });
//       setAssets(albumAssets.assets);
//     }
//     getAlbumAssets();
//   }, [album]);

//   return (
//     <View key={album.id}>
//       <ThemedText>
//         {album.title} - {album.assetCount ?? "no"} assets
//       </ThemedText>
//       <View>
//         {assets &&
//           assets.map((asset) => (
//             <Image source={{ uri: asset.uri }} style={styles.albumImage} />
//           ))}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   albumImage: {
//     width: 40,
//     height: 40,
//     margin: 5,
//   },
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   contentContainer: {
//     flex: 1,
//     marginHorizontal: 10,
//     borderRadius: 10,
//     padding: 10,
//     backgroundColor: "#f0f0f0",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 20,
//   },
//   containerShadow: {
//     shadowColor: "#000",
//     shadowOpacity: 0.4,
//     shadowRadius: 2,
//     shadowOffset: { width: 3, height: 3 },
//   },
// });
