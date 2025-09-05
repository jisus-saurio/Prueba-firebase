import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const FuturisticHeader = ({ 
  fadeAnim, 
  slideAnim, 
  pulseAnim, 
  title = "TÍTULO",
  subtitle = "Subtítulo del Sistema",
  statusText = "MÓDULO ACTIVO",
  statusColor = "#10b981",
  titleColor = "#10b981",
  logoElement = null,
  userName = null
}) => (
  <Animated.View
    style={[
      styles.headerContainer,
      {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      },
    ]}
  >
    <Animated.View
      style={[
        styles.logoContainer,
        {
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      <View style={styles.logoCircle}>
        <View style={[styles.logoInner, { backgroundColor: `${titleColor}33` }]}>
          {logoElement ? logoElement : (
            userName ? (
              <Text style={styles.logoText}>
                {userName.charAt(0).toUpperCase()}
              </Text>
            ) : (
              <View style={[styles.logoIcon, { backgroundColor: titleColor }]} />
            )
          )}
        </View>
        <View style={[styles.logoRing, { borderColor: `${titleColor}4D` }]} />
        <View style={[styles.logoRing2, { borderColor: `${titleColor}33` }]} />
      </View>
    </Animated.View>
    
    <Text style={[styles.titleText, { 
      textShadowColor: `${titleColor}80`,
      color: '#ffffff'
    }]}>
      {title}
    </Text>
    <Text style={styles.subtitleText}>{subtitle}</Text>
    
    <View style={styles.statusIndicator}>
      <Animated.View
        style={[
          styles.statusDot,
          {
            backgroundColor: statusColor,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
      <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
    </View>
  </Animated.View>
);

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#10b981',
    borderRadius: 10,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 1,
  },
  logoRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderStyle: 'dashed',
  },
  logoRing2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  titleText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2,
    marginBottom: 4,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  subtitleText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
});

export default FuturisticHeader;