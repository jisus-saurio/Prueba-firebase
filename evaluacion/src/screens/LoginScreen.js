import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
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

// Importar componentes
import BackgroundEffectsCustom from '../components/BackgroundEffectsCustom';
import FuturisticHeader from '../components/FuturisticHeader';
import FuturisticInput from '../components/FuturisticInput';
import InfoPanel from '../components/InfoPanel';
import FuturisticButton from '../components/FuturisticButton';
import AuthFormWrapper from '../components/AuthFormWrapper';
import AnimatedLogo from '../components/AnimatedLogo';

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

  return (
    <View style={styles.container}>
      <BackgroundEffectsCustom 
        pulseAnim={pulseAnim} 
        rotateAnim={rotateAnim}
        particleCount={10}
        primaryColor="rgba(0, 212, 255, 0.6)"
        gradientColors={{
          layer1: 'rgba(16, 185, 129, 0.08)',
          layer2: 'rgba(59, 130, 246, 0.06)',
          layer3: 'rgba(147, 51, 234, 0.04)',
        }}
        cornerColor="rgba(0, 212, 255, 0.3)"
      />

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
            <AnimatedLogo
              size={100}
              rotateAnim={rotateAnim}
              fadeAnim={fadeAnim}
              innerColor="rgba(0, 212, 255, 0.2)"
              iconColor="#00d4ff"
              ring1Color="rgba(0, 212, 255, 0.3)"
              ring2Color="rgba(16, 185, 129, 0.2)"
            />
            
            <Text style={styles.title}>BIENVENIDO</Text>
            <Text style={styles.subtitle}>Acceso al Sistema</Text>
            
            <AuthFormWrapper.DecorativeLines />
          </Animated.View>

          {/* Formulario futurista */}
          <AuthFormWrapper
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
          >
            {/* Campo Email */}
            <FuturisticInput
              label="CORREO ELECTRÓNICO"
              value={email}
              onChangeText={setEmail}
              placeholder="ejemplo@correo.com"
              focused={focusedInput === 'email'}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Campo Contraseña */}
            <FuturisticInput
              label="CONTRASEÑA"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              focused={focusedInput === 'password'}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
              keyboardType="default"
              autoCapitalize="none"
            />

            {/* Panel de estado */}
            <InfoPanel 
              title="ESTADO DEL SISTEMA"
              titleColor="#10b981"
              dotColor="#10b981"
              backgroundColor="rgba(16, 185, 129, 0.05)"
              borderColor="rgba(16, 185, 129, 0.2)"
            >
              <Animated.View
                style={[
                  styles.statusHeader,
                  {
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              >
                <View style={styles.statusDot} />
                <Text style={styles.statusTitle}>SISTEMA OPERATIVO</Text>
              </Animated.View>
              <InfoPanel.Text>Conexión segura establecida</InfoPanel.Text>
              <InfoPanel.Text>Servidor operativo</InfoPanel.Text>
            </InfoPanel>

            {/* Botón de login */}
            <FuturisticButton
              title="INICIAR SESIÓN"
              variant="secondary"
              onPress={handleLogin}
              disabled={isLoading}
              loading={isLoading}
              style={styles.loginButton}
            />

            <AuthFormWrapper.Divider />

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
          </AuthFormWrapper>
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
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 6,
    marginBottom: 8,
    marginTop: 30,
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

  // Status panel interno
  statusHeader: {
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
  statusTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981',
    letterSpacing: 1,
  },

  // Botón de login
  loginButton: {
    marginBottom: 30,
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