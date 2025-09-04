import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  // Animaciones
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [rotateAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animaciones de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de rotación continua
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();

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
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      let message = 'Error al iniciar sesión';
      
      switch (error.code) {
        case 'auth/user-not-found':
          message = 'Usuario no encontrado';
          break;
        case 'auth/wrong-password':
          message = 'Contraseña incorrecta';
          break;
        case 'auth/invalid-email':
          message = 'Correo electrónico inválido';
          break;
        case 'auth/too-many-requests':
          message = 'Demasiados intentos fallidos. Intenta más tarde';
          break;
      }
      
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Fondo futurista */}
      <View style={styles.backgroundGradient}>
        <View style={[styles.gradientLayer, styles.gradientLayer1]} />
        <View style={[styles.gradientLayer, styles.gradientLayer2]} />
        <View style={[styles.gradientLayer, styles.gradientLayer3]} />
      </View>

      {/* Partículas flotantes */}
      <View style={styles.particlesContainer}>
        {[...Array(10)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
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
        <View style={[styles.cornerEffect, styles.topLeft]} />
        <View style={[styles.cornerEffect, styles.topRight]} />
        <View style={[styles.cornerEffect, styles.bottomLeft]} />
        <View style={[styles.cornerEffect, styles.bottomRight]} />
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header futurista */}
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
                  transform: [{ rotate: spin }],
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
            
            <Text style={styles.title}>BIENVENIDO</Text>
            <Text style={styles.subtitle}>Acceso al Sistema</Text>
            
            <View style={styles.decorativeLines}>
              <View style={styles.line} />
              <View style={styles.centerDot} />
              <View style={styles.line} />
            </View>
          </Animated.View>

          {/* Formulario futurista */}
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Campo Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
              <View style={[
                styles.inputWrapper,
                focusedInput === 'email' && styles.inputWrapperFocused
              ]}>
                <TextInput
                  style={styles.input}
                  placeholder="ejemplo@correo.com"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                />
                <View style={styles.inputGlow} />
              </View>
            </View>

            {/* Campo Contraseña */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CONTRASEÑA</Text>
              <View style={[
                styles.inputWrapper,
                focusedInput === 'password' && styles.inputWrapperFocused
              ]}>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password"
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                />
                <View style={styles.inputGlow} />
              </View>
            </View>

            {/* Panel de estado */}
            <View style={styles.statusPanel}>
              <View style={styles.statusPanelHeader}>
                <Animated.View
                  style={[
                    styles.statusDot,
                    {
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                />
                <Text style={styles.statusPanelTitle}>ESTADO DEL SISTEMA</Text>
              </View>
              <Text style={styles.statusText}>Conexión segura establecida</Text>
              <Text style={styles.statusText}>Servidor operativo</Text>
            </View>

            {/* Botón de login */}
            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'AUTENTICANDO...' : 'INICIAR SESIÓN'}
                </Text>
                <View style={styles.buttonGlow} />
              </View>
            </TouchableOpacity>

            {/* Separador */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <View style={styles.dividerDot} />
              <View style={styles.dividerLine} />
            </View>

            {/* Link de registro */}
            <View style={styles.registerSection}>
              <Text style={styles.registerText}>¿Primera vez en el sistema?</Text>
              <TouchableOpacity 
                style={styles.registerButton}
                onPress={() => navigation.navigate('Register')}
                activeOpacity={0.7}
              >
                <Text style={styles.registerButtonText}>CREAR CUENTA</Text>
                <View style={styles.registerButtonGlow} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },

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
  gradientLayer1: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  gradientLayer2: {
    backgroundColor: 'rgba(59, 130, 246, 0.06)',
    transform: [{ rotate: '30deg' }],
  },
  gradientLayer3: {
    backgroundColor: 'rgba(147, 51, 234, 0.04)',
    transform: [{ rotate: '-30deg' }],
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
    width: 3,
    height: 3,
    backgroundColor: 'rgba(0, 212, 255, 0.6)',
    borderRadius: 1.5,
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
    width: 50,
    height: 50,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  topLeft: {
    top: 60,
    left: 20,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  topRight: {
    top: 60,
    right: 20,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  bottomLeft: {
    bottom: 40,
    left: 20,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  bottomRight: {
    bottom: 40,
    right: 20,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },

  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
  },

  // Header
  headerContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoContainer: {
    marginBottom: 30,
    position: 'relative',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#00d4ff',
    borderRadius: 12,
  },
  logoRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
    borderStyle: 'dashed',
  },
  logoRing2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 6,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 212, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 2,
    marginBottom: 20,
  },
  decorativeLines: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  line: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(0, 212, 255, 0.5)',
  },
  centerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00d4ff',
  },

  // Formulario
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
    marginBottom: 10,
  },
  inputWrapper: {
    position: 'relative',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputWrapperFocused: {
    borderColor: 'rgba(0, 212, 255, 0.5)',
    backgroundColor: 'rgba(0, 212, 255, 0.05)',
  },
  input: {
    padding: 18,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  inputGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },

  // Panel de estado
  statusPanel: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 8,
  },
  statusPanelTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981',
    letterSpacing: 1,
  },
  statusText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },

  // Botón de login
  loginButton: {
    borderRadius: 12,
    marginBottom: 30,
    position: 'relative',
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    backgroundColor: 'rgba(0, 212, 255, 0.8)',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    position: 'relative',
  },
  loginButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
  },
  buttonGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 212, 255, 0.3)',
    zIndex: -1,
  },

  // Separador
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },

  // Sección de registro
  registerSection: {
    alignItems: 'center',
    gap: 16,
  },
  registerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 1,
  },
  registerButton: {
    position: 'relative',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  registerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
  },
  registerButtonGlow: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: -1,
  },
});