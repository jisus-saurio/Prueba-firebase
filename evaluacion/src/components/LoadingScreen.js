import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const LoadingScreen = ({ 
  pulseAnim, 
  text = "CARGANDO SISTEMA...",
  iconColor = "#00d4ff",
  backgroundColor = "#0a0a0a"
}) => (
  <View style={[styles.loadingContainer, { backgroundColor }]}>
    <Animated.View
      style={[
        styles.loadingContent,
        {
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      <View style={[styles.loadingIcon, { backgroundColor: iconColor }]} />
      <Text style={styles.loadingText}>{text}</Text>
    </Animated.View>
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00d4ff',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '700',
    letterSpacing: 2,
  },
});

export default LoadingScreen;