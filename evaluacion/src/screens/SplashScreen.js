import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';

// Importar componentes
import BackgroundEffectsCustom from '../components/BackgroundEffectsCustom';
import AuthFormWrapper from '../components/AuthFormWrapper';

const { width, height } = Dimensions.get('window');

// Componente para el logo del splash
const SplashLogo = ({ fadeAnim, scaleAnim, rotateAnim }) => {
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
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
      <View style={styles.logoCircle}>
        <View style={styles.logoInner}>
          <View style={styles.logoIcon} />
        </View>
        <View style={styles.logoRing} />
        <View style={styles.logoRing2} />
      </View>
    </Animated.View>
  );
};

// Componente para el título animado
const SplashTitle = ({ fadeAnim, slideAnim }) => (
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
    
    <AuthFormWrapper.DecorativeLines 
      lineColor="rgba(0, 212, 255, 0.5)"
      dotColor="#00d4ff"
    />
  </Animated.View>
);

// Componente para el indicador de carga
const LoadingIndicator = ({ fadeAnim, pulseAnim, progressAnim }) => {
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
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
  );
};

// Componente para información de versión
const VersionInfo = ({ fadeAnim }) => (
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
);

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

  return (
    <View style={styles.container}>
      <BackgroundEffectsCustom 
        pulseAnim={pulseAnim} 
        rotateAnim={rotateAnim}
        particleCount={12}
        primaryColor="rgba(0, 212, 255, 0.6)"
        gradientColors={{
          layer1: 'rgba(16, 185, 129, 0.1)',
          layer2: 'rgba(59, 130, 246, 0.08)',
          layer3: 'rgba(147, 51, 234, 0.06)',
        }}
        cornerColor="rgba(0, 212, 255, 0.3)"
        cornerSize={60}
        cornerOffset={{ top: 30, bottom: 30, side: 30 }}
      />

      {/* Contenido principal */}
      <View style={styles.content}>
        {/* Logo animado */}
        <SplashLogo 
          fadeAnim={fadeAnim}
          scaleAnim={scaleAnim}
          rotateAnim={rotateAnim}
        />

        {/* Título animado */}
        <SplashTitle 
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
        />

        {/* Indicador de carga moderno */}
        <LoadingIndicator 
          fadeAnim={fadeAnim}
          pulseAnim={pulseAnim}
          progressAnim={progressAnim}
        />
      </View>

      {/* Información de versión */}
      <VersionInfo fadeAnim={fadeAnim} />
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
    width: 30,
    height: 30,
    backgroundColor: '#00d4ff',
    borderRadius: 15,
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
});