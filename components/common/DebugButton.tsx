/* eslint-disable react/display-name */
import { memo, useRef } from "react";
import { StyleSheet, Animated, TouchableOpacity } from "react-native";
import {
  PanGestureHandler,
  State,
  PanGestureHandlerStateChangeEvent,
} from "react-native-gesture-handler";

import { IconSymbol } from "../ui/IconSymbol";

// A draggable debug button component
const DebugButton = memo(({ action }: { action: () => void }) => {
  // Use animated values to track position
  const pan = useRef(new Animated.ValueXY({ x: 20, y: 15 })).current;

  // Handle gesture events
  const onGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: pan.x,
          translationY: pan.y,
        },
      },
    ],
    { useNativeDriver: false },
  );

  // Handle state changes in the gesture
  const onHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      // Update the offset when the gesture ends
      pan.extractOffset();
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View
        style={[
          styles.debugButton,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          },
        ]}
      >
        <Animated.View>
          <TouchableOpacity onPress={action}>
            <IconSymbol name="ladybug" size={30} color="#999" />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
});

const styles = StyleSheet.create({
  debugButton: {
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    position: "absolute",
    zIndex: 999,
    top: 0,
    right: 30,
    backgroundColor: "#fff",
    borderRadius: 100,
  },
});

export default DebugButton;
