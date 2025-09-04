import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.5));
  const [slideAnim] = useState(new Animated.Value(-100));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [progressAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Secuencia de animaciones
    const startAnimations = () => {
      // Animación de entrada del logo
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Animación del texto deslizándose
      setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 400);

      // Animación de rotación continua
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();

      // Animación de pulso del loading
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.2,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }, 1000);

      // Barra de progreso
      setTimeout(() => {
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }).start();
      }, 1200);
    };

    startAnimations();

    const timer = setTimeout(() => {
      // Lógica para navegar a la siguiente pantalla
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Fondo con gradiente animado */}
      <View style={styles.backgroundGradient}>
        <View style={[styles.gradientLayer, styles.gradientLayer1]} />
        <View style={[styles.gradientLayer, styles.gradientLayer2]} />
        <View style={[styles.gradientLayer, styles.gradientLayer3]} />
      </View>

      {/* Partículas flotantes */}
      <View style={styles.particlesContainer}>
        {[...Array(12)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                top: Math.random() * height,
                left: Math.random() * width,
                transform: [
                  {
                    rotate: spin,
                  },
                  {
                    scale: pulseAnim,
                  },
                ],
              },
            ]}
          />
        ))}
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        {/* Logo animado */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { rotate: spin },
              ],
            },
          ]}
        >
        </Animated.View>

        {/* Título animado */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.mainTitle}>USERFULY</Text>
          <Text style={styles.subtitle}>Connect • Create • Collaborate</Text>
          
          {/* Líneas decorativas */}
          <View style={styles.decorativeLines}>
            <View style={styles.line} />
            <View style={styles.centerDot} />
            <View style={styles.line} />
          </View>
        </Animated.View>

        {/* Indicador de carga moderno */}
        <Animated.View
          style={[
            styles.loadingSection,
            {
              opacity: fadeAnim,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.loadingContainer}>
            <View style={styles.spinner}>
              <ActivityIndicator size="large" color="#00d4ff" />
            </View>
            <Text style={styles.loadingText}>Inicializando...</Text>
          </View>

          {/* Barra de progreso */}
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressWidth,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>Cargando recursos</Text>
        </Animated.View>
      </View>

      {/* Información de versión */}
      <Animated.View
        style={[
          styles.versionContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={styles.versionText}>v2.0.0 Beta</Text>
        <Text style={styles.copyrightText}>© 2024 - Powered by React Native</Text>
      </Animated.View>

      {/* Efectos de esquinas */}
      <View style={styles.cornerEffects}>
        <View style={[styles.cornerEffect, styles.topLeft]} />
        <View style={[styles.cornerEffect, styles.topRight]} />
        <View style={[styles.cornerEffect, styles.bottomLeft]} />
        <View style={[styles.cornerEffect, styles.bottomRight]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Fondo con gradientes animados
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
  gradientLayer1: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  gradientLayer2: {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    transform: [{ rotate: '45deg' }],
  },
  gradientLayer3: {
    backgroundColor: 'rgba(147, 51, 234, 0.06)',
    transform: [{ rotate: '-45deg' }],
  },

  // Partículas flotantes
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: 'rgba(0, 212, 255, 0.6)',
    borderRadius: 2,
  },

  content: {
    alignItems: 'center',
    zIndex: 1,
  },

  // Logo moderno
  logoContainer: {
    marginBottom: 50,
    position: 'relative',
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 40,
  },
  logoRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'rgba(0, 212, 255, 0.3)',
    borderStyle: 'dashed',
  },
  logoRing2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },

  // Título
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 8,
    textShadowColor: 'rgba(0, 212, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 20,
  },

  // Líneas decorativas
  decorativeLines: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  line: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(0, 212, 255, 0.5)',
  },
  centerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00d4ff',
  },

  // Sección de carga
  loadingSection: {
    alignItems: 'center',
    gap: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    gap: 15,
  },
  spinner: {
    padding: 10,
  },
  loadingText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '300',
    letterSpacing: 1,
  },

  // Barra de progreso
  progressBarContainer: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00d4ff',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 8,
  },

  // Versión
  versionContainer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
    marginBottom: 5,
  },
  copyrightText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
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
    width: 60,
    height: 60,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  topLeft: {
    top: 30,
    left: 30,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  topRight: {
    top: 30,
    right: 30,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  bottomLeft: {
    bottom: 30,
    left: 30,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  bottomRight: {
    bottom: 30,
    right: 30,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
});