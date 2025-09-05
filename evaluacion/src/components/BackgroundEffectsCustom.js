import React from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const BackgroundEffectsCustom = ({ 
  pulseAnim, 
  rotateAnim, 
  particleCount = 10,
  primaryColor = 'rgba(16, 185, 129, 0.6)',
  gradientColors = {
    layer1: 'rgba(16, 185, 129, 0.08)',
    layer2: 'rgba(59, 130, 246, 0.06)',
    layer3: 'rgba(147, 51, 234, 0.04)',
  },
  cornerColor = 'rgba(16, 185, 129, 0.3)',
  cornerSize = 50,
  cornerOffset = { top: 60, bottom: 120, side: 20 }
}) => {
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <>
      {/* Fondo futurista */}
      <View style={styles.backgroundGradient}>
        <View style={[styles.gradientLayer, { backgroundColor: gradientColors.layer1 }]} />
        <View style={[
          styles.gradientLayer, 
          { 
            backgroundColor: gradientColors.layer2,
            transform: [{ rotate: '30deg' }]
          }
        ]} />
        <View style={[
          styles.gradientLayer, 
          { 
            backgroundColor: gradientColors.layer3,
            transform: [{ rotate: '-30deg' }]
          }
        ]} />
      </View>

      {/* Partículas flotantes */}
      <View style={styles.particlesContainer}>
        {[...Array(particleCount)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                backgroundColor: primaryColor,
                top: Math.random() * height,
                left: Math.random() * width,
                transform: [
                  { scale: pulseAnim },
                  { rotate: spin },
                ],
              },
            ]}
          />
        ))}
      </View>

      {/* Efectos de esquinas */}
      <View style={styles.cornerEffects}>
        <View style={[
          styles.cornerEffect, 
          {
            top: cornerOffset.top,
            left: cornerOffset.side,
            width: cornerSize,
            height: cornerSize,
            borderColor: cornerColor,
            borderTopWidth: 2,
            borderLeftWidth: 2,
          }
        ]} />
        <View style={[
          styles.cornerEffect,
          {
            top: cornerOffset.top,
            right: cornerOffset.side,
            width: cornerSize,
            height: cornerSize,
            borderColor: cornerColor,
            borderTopWidth: 2,
            borderRightWidth: 2,
          }
        ]} />
        <View style={[
          styles.cornerEffect,
          {
            bottom: cornerOffset.bottom,
            left: cornerOffset.side,
            width: cornerSize,
            height: cornerSize,
            borderColor: cornerColor,
            borderBottomWidth: 2,
            borderLeftWidth: 2,
          }
        ]} />
        <View style={[
          styles.cornerEffect,
          {
            bottom: cornerOffset.bottom,
            right: cornerOffset.side,
            width: cornerSize,
            height: cornerSize,
            borderColor: cornerColor,
            borderBottomWidth: 2,
            borderRightWidth: 2,
          }
        ]} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  // Fondo futurista
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // Partículas
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
  },

  // Efectos de esquinas
  cornerEffects: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  cornerEffect: {
    position: 'absolute',
  },
});

export default BackgroundEffectsCustom;