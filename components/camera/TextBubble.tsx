/* eslint-disable import/no-unresolved */
import React, { useEffect, useRef, useCallback } from "react";
import { StyleSheet, View, Animated, Text } from "react-native";

import { customIcons } from "@/assets/icons/customIcons";
import { Colors } from "@/constants/Colors";

type Orientation = "up" | "down" | "left" | "right";

interface TextBubbleProps {
  text: string | string[];
  bubbleColor?: string;
  textColor?: string;
  width?: number;
  height?: number;
  orientation?: Orientation;
  autoHide?: boolean;
  animationDuration?: number;
  displayDuration?: number;
  style?: object;
  onAnimationEnd?: () => void;
  triggerAnimation?: boolean; // Pass true to trigger animation from parent
}

export const TextBubble: React.FC<TextBubbleProps> = ({
  text,
  bubbleColor = Colors.light.background,
  textColor = Colors.light.primary,
  width = 300,
  height = 150,
  orientation = "up",
  autoHide = true,
  animationDuration = 800,
  displayDuration = 2000,
  style,
  onAnimationEnd,
  triggerAnimation = false,
}) => {
  // Animation value for the hint bubble
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Reference to the hint bubble timer
  const hintTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to show the hint bubble with animation
  const showBubble = useCallback(() => {
    // Clear any existing timer
    if (hintTimerRef.current) {
      clearTimeout(hintTimerRef.current);
    }

    // Reset animation value
    fadeAnim.setValue(0);

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();

    if (autoHide) {
      // Fade out after display duration
      hintTimerRef.current = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished && onAnimationEnd) {
            onAnimationEnd();
          }
        });
      }, displayDuration);
    }
  }, [fadeAnim, animationDuration, displayDuration, autoHide, onAnimationEnd]);

  // Show bubble on component mount or when triggerAnimation changes to true
  useEffect(() => {
    if (triggerAnimation) {
      showBubble();
    }
  }, [triggerAnimation, showBubble]);

  // Show bubble on component mount if autoShow is true
  useEffect(() => {
    showBubble();

    // Clean up timer on unmount
    return () => {
      if (hintTimerRef.current) {
        clearTimeout(hintTimerRef.current);
      }
    };
  }, [showBubble]);

  // Process text to handle array of strings
  const textContent = Array.isArray(text) ? text : [text];

  return (
    <Animated.View
      style={[
        styles.bubbleContainer,
        style,
        {
          opacity: fadeAnim,
          transform: [
            {
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.bubbleSvgContainer}>
        {customIcons.bubbleText(bubbleColor, width, height, orientation)}
        <View style={styles.textBox}>
          {textContent.map((line, index) => (
            <Text
              key={`line-${index}`}
              style={[styles.text, { color: textColor }]}
            >
              {line}
            </Text>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bubbleContainer: {
    alignItems: "center",
  },
  bubbleSvgContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  textBox: {
    position: "absolute",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 30, // Adjust based on SVG shape
  },
  text: {
    fontFamily: "PokemonClassic",
    fontSize: 12,
    textAlign: "center",
    marginVertical: 2,
  },
});
