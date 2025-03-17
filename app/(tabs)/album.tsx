import * as MediaLibrary from "expo-media-library";
import { useState, useEffect } from "react";
import {
  Button,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  View,
} from "react-native";

export default function App() {
  const [albums, setAlbums] = useState(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  async function getAlbums() {
    if (permissionResponse?.status !== "granted") {
      await requestPermission();
    }
    const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });
    setAlbums(fetchedAlbums);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Button onPress={getAlbums} title="Get albums" />
      <ScrollView>
        {albums && albums.map((album) => <AlbumEntry album={album} />)}
      </ScrollView>
    </SafeAreaView>
  );
}

function AlbumEntry({ album }: { album: MediaLibrary.Album }) {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    async function getAlbumAssets() {
      const albumAssets = await MediaLibrary.getAssetsAsync({ album });
      setAssets(albumAssets.assets);
    }
    getAlbumAssets();
  }, [album]);

  return (
    <View key={album.id}>
      <Text>
        {album.title} - {album.assetCount ?? "no"} assets
      </Text>
      <View>
        {assets &&
          assets.map((asset) => (
            <Image source={{ uri: asset.uri }} width={50} height={50} />
          ))}
      </View>
    </View>
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
