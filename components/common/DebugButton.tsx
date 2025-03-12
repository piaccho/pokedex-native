import { memo } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

import { IconSymbol } from "../ui/IconSymbol";

// eslint-disable-next-line react/display-name
const DebugButton = memo(({ action }: { action: () => void }) => {
  return (
    <TouchableOpacity style={styles.debugButton} onPress={() => action()}>
      <IconSymbol name="ladybug" size={30} color="#999" />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  debugButton: {
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    position: "absolute",
    zIndex: 1,
    top: 15,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 100,
  },
});

export default DebugButton;
