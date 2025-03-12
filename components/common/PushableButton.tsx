import {
  GestureResponderEvent,
  Pressable,
  View,
  StyleSheet,
} from "react-native";

interface PushableButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  icon: React.ReactNode;
  width?: number;
  height?: number;
  style?: any;
}

// Pushable button component with proper typing
export const PushableButton = ({
  onPress,
  disabled = false,
  icon,
  width = 60,
  height = 60,
  style,
}: PushableButtonProps) => {
  // Generate dynamic styles based on props
  const dynamicPushableStyle = {
    width,
    height,
  };

  const dynamicFrontStyle = {
    width,
    height,
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.pushable,
        dynamicPushableStyle,
        disabled && styles.disabledPushable,
      ]}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.front,
            dynamicFrontStyle,
            disabled && styles.disabledFront,
            // When pressed, reduce the translateY value to simulate pushing
            { transform: [{ translateY: pressed ? -2 : -6 }] },
            style,
          ]}
        >
          {icon}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // Styles for the base/shadow of the button
  pushable: {
    backgroundColor: "#ddd", // Darker red (base/shadow)
    borderRadius: 12,
    padding: 0,
  },
  // Styles for the front face of the button
  front: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff", // Brighter red (front)
    color: "white",
    transform: [{ translateY: -6 }],
    justifyContent: "center",
    alignItems: "center",
  },
  // Disabled styles
  disabledPushable: {
    backgroundColor: "#666", // Darker gray for disabled shadow
  },
  disabledFront: {
    backgroundColor: "#999", // Gray for disabled front
    opacity: 0.5,
  },
});
