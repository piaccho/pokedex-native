import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemedSafeAreaView } from "@/components/common/ThemedSafeAreaView";

export default function PokemonCameraScreen() {
  return (
    <SafeAreaProvider>
      <ThemedSafeAreaView>
        <GestureHandlerRootView>
          <View />
        </GestureHandlerRootView>
      </ThemedSafeAreaView>
    </SafeAreaProvider>
  );
}
