import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function FuturisticTabBar({ state, descriptors, navigation }) {
  const [indicatorPosition] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [glowAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animación del indicador de pestaña activa
    Animated.timing(indicatorPosition, {
      toValue: state.index,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Animación de pulso continua
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animación de brillo continua
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [state.index]);

  const tabWidth = (width - 40) / state.routes.length;

  const getTabIcon = (routeName, isFocused) => {
    const baseStyle = {
      width: 20,
      height: 20,
      borderRadius: 10,
      marginBottom: 4,
    };

    switch (routeName) {
      case 'Home':
        return (
          <View
            style={[
              baseStyle,
              {
                backgroundColor: isFocused ? '#000000' : '#00d4ff',
              },
            ]}
          />
        );
      case 'AddUser':
        return (
          <View
            style={[
              baseStyle,
              {
                backgroundColor: isFocused ? '#000000' : '#10b981',
              },
            ]}
          />
        );
      case 'List':
        return (
          <View
            style={[
              baseStyle,
              {
                backgroundColor: isFocused ? '#000000' : '#a855f7',
              },
            ]}
          />
        );
      default:
        return (
          <View
            style={[
              baseStyle,
              {
                backgroundColor: isFocused ? '#000000' : '#ffffff',
              },
            ]}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Efectos de fondo */}
      <View style={styles.backgroundEffects}>
        <View style={[styles.backgroundLayer, styles.layer1]} />
        <View style={[styles.backgroundLayer, styles.layer2]} />
        <View style={[styles.backgroundLayer, styles.layer3]} />
      </View>

      {/* Partículas flotantes */}
      <View style={styles.particlesContainer}>
        {[...Array(8)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                left: Math.random() * width,
                transform: [{ scale: pulseAnim }],
                opacity: glowAnim,
              },
            ]}
          />
        ))}
      </View>

      {/* Indicador de pestaña activa */}
      <Animated.View
        style={[
          styles.activeIndicator,
          {
            left: indicatorPosition.interpolate({
              inputRange: state.routes.map((_, i) => i),
              outputRange: state.routes.map((_, i) => 20 + i * tabWidth),
            }),
            width: tabWidth,
          },
        ]}
      />

      {/* Contenedor de pestañas */}
      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel || options.title || route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[styles.tab, { width: tabWidth }]}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  styles.tabContent,
                  isFocused && styles.tabContentActive,
                  {
                    transform: [
                      {
                        scale: isFocused ? pulseAnim : 1,
                      },
                    ],
                  },
                ]}
              >
                {/* Icono de la pestaña */}
                {getTabIcon(route.name, isFocused)}

                {/* Texto de la pestaña */}
                <Text
                  style={[
                    styles.tabLabel,
                    isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
                  ]}
                >
                  {label}
                </Text>

                {/* Efecto de brillo para pestaña activa */}
                {isFocused && (
                  <Animated.View
                    style={[
                      styles.activeGlow,
                      {
                        opacity: glowAnim,
                      },
                    ]}
                  />
                )}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Efectos de esquinas */}
      <View style={styles.cornerEffects}>
        <View style={[styles.corner, styles.cornerTopLeft]} />
        <View style={[styles.corner, styles.cornerTopRight]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },

  // Efectos de fondo
  backgroundEffects: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  layer1: {
    backgroundColor: 'rgba(0, 212, 255, 0.03)',
  },
  layer2: {
    backgroundColor: 'rgba(16, 185, 129, 0.02)',
    transform: [{ skewX: '15deg' }],
  },
  layer3: {
    backgroundColor: 'rgba(168, 85, 247, 0.02)',
    transform: [{ skewX: '-15deg' }],
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
    width: 1.5,
    height: 1.5,
    backgroundColor: 'rgba(0, 212, 255, 0.8)',
    borderRadius: 0.75,
    top: Math.random() * 60,
  },

  // Indicador activo
  activeIndicator: {
    position: 'absolute',
    top: 18,
    height: 50,
    backgroundColor: 'rgba(0, 212, 255, 0.8)',
    borderRadius: 12,
    zIndex: 1,
  },

  // Contenedor de pestañas
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },

  // Pestaña individual
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    position: 'relative',
  },
  tabContentActive: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
  },

  // Texto de la pestaña
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  tabLabelActive: {
    color: '#000000',
    textShadowColor: 'rgba(0, 212, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  tabLabelInactive: {
    color: 'rgba(255, 255, 255, 0.7)',
  },

  // Efecto de brillo activo
  activeGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    zIndex: -1,
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
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  cornerTopLeft: {
    top: 8,
    left: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
  },
  cornerTopRight: {
    top: 8,
    right: 24,
    borderTopWidth: 1,
    borderRightWidth: 1,
  },
});