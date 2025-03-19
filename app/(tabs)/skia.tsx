import {
  createPicture,
  Skia,
  BlendMode,
  Canvas,
  Picture,
} from "@shopify/react-native-skia";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemedSafeAreaView } from "@/components/common/ThemedSafeAreaView";

export default function SkiaTestScreen() {
  const picture = useMemo(
    () =>
      createPicture((canvas) => {
        const size = 256;
        const r = 0.33 * size;
        const paint = Skia.Paint();
        paint.setBlendMode(BlendMode.Multiply);

        paint.setColor(Skia.Color("cyan"));
        canvas.drawCircle(r, r, r, paint);

        paint.setColor(Skia.Color("magenta"));
        canvas.drawCircle(size - r, r, r, paint);

        paint.setColor(Skia.Color("yellow"));
        canvas.drawCircle(size / 2, size - r, r, paint);
      }),
    [],
  );
  return (
    <SafeAreaProvider>
      <ThemedSafeAreaView style={styles.container}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Canvas style={{ flex: 1 }}>
            <Picture picture={picture} />
          </Canvas>
        </GestureHandlerRootView>
      </ThemedSafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
