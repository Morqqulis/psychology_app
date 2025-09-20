import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useMainContext } from '@/providers/MainProvider';
import { Colors } from '@/constants/theme';

export function TypingIndicator() {
  const { them } = useMainContext();
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      const animation = Animated.sequence([
        Animated.timing(dot1, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot1, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]);

      const animation2 = Animated.sequence([
        Animated.delay(200),
        Animated.timing(dot2, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot2, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]);

      const animation3 = Animated.sequence([
        Animated.delay(400),
        Animated.timing(dot3, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot3, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]);

      Animated.loop(
        Animated.parallel([animation, animation2, animation3])
      ).start();
    };

    animate();
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.bubble, { backgroundColor: Colors[them].chatBubbleAI }]}>
        <View style={styles.dotsContainer}>
          <Animated.View
            style={[
              styles.dot,
              { backgroundColor: Colors[them].icon, opacity: dot1 }
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              { backgroundColor: Colors[them].icon, opacity: dot2 }
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              { backgroundColor: Colors[them].icon, opacity: dot3 }
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
});