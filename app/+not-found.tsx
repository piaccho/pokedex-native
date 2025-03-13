import { Link } from "expo-router";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemedSafeAreaView } from "@/components/common/ThemedSafeAreaView";
import { ThemedText } from "@/components/common/ThemedText";
import { ThemedView } from "@/components/common/ThemedView";

export default function NotFoundScreen() {
  return (
    <SafeAreaProvider>
      <ThemedSafeAreaView style={styles.container}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemedView style={styles.container}>
            <ThemedText type="title">This screen doesn't exist.</ThemedText>
            <Link href="/" style={styles.link}>
              <ThemedText type="link">Go to home screen!</ThemedText>
            </Link>
          </ThemedView>
        </GestureHandlerRootView>
      </ThemedSafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
